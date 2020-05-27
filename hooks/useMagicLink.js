// https://github.com/arunoda/use-magic-link/blob/master/src/use-magic-link.js

import { useState, useEffect } from 'react'
import EventEmitter from 'event-emitter'
import unfetch from 'isomorphic-unfetch'
import { Sema } from 'async-sema'
import loadMagicLink from '../lib/loadMagicLink'

const tokenSema = new Sema(1)
const loggedInSema = new Sema(1)
const loginEvents = new EventEmitter()

const ONE_MINUTE = 1000 * 60

let currentLoginState = null
let currentToken = null

if (typeof window !== 'undefined') {
  loadMagicLink()
}

async function getMagicToken(magicLinkKey) {
  await tokenSema.acquire()
  console.log('acquired 2')
  try {
    if (currentToken && currentToken.expiredAt > Date.now()) {
      return currentToken.token
    }

    const magic = await loadMagicLink(magicLinkKey)
    console.log('got 2')
    const token = await magic.user.getIdToken()
    console.log('got 3')
    setToken(token)
    return token
  } catch (e) {
    console.log('ee', e)
  } finally {
    console.log('finally')
    tokenSema.release()
  }
}

async function isLoggedIn(magicLinkKey) {
  await loggedInSema.acquire()
  console.log('acquired')
  try {
    if (currentLoginState !== null) {
      return currentLoginState
    }

    await getMagicToken(magicLinkKey)
    console.log('got')
    currentLoginState = true
  } catch (err) {
    currentLoginState = false
  } finally {
    loggedInSema.release()
  }

  return currentLoginState
}

function setToken(token, lifespan = ONE_MINUTE * 15) {
  currentToken = {
    token,
    expiredAt: Date.now() + lifespan - ONE_MINUTE,
  }
}

console.log('before', currentLoginState)

export default function useAuth(magicLinkKey) {
  if (!magicLinkKey) {
    throw new Error('Magic Link publishableKey required as the first argument')
  }

  const [loggedIn, setLoggedIn] = useState(
    currentLoginState !== null ? currentLoginState : false
  )
  const [loading, setLoading] = useState(currentLoginState === null)
  const [error, setError] = useState(null)
  const [loggingIn, setLoggingIn] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [magic, setMagic] = useState(null)

  console.log('during', currentLoginState, loading)

  async function login(email) {
    setError(null)
    setLoggingIn(true)

    try {
      const magic = await loadMagicLink(magicLinkKey)
      const token = await magic.auth.loginWithMagicLink({ email })
      currentLoginState = true
      setToken(token)
      loginEvents.emit('loggedIn', true)
      setLoggedIn(true)
    } catch (err) {
      setError(err)
    } finally {
      setLoggingIn(false)
    }
  }

  async function logout() {
    setError(null)
    setLoggingOut(true)

    try {
      const magic = await loadMagicLink(magicLinkKey)
      await magic.user.logout()
      currentLoginState = null
      currentToken = null
      loginEvents.emit('loggedIn', false)
      setLoggedIn(false)
    } catch (err) {
      setError(err)
    } finally {
      setLoggingOut(false)
    }

    return currentLoginState === null
  }

  async function fetch(url, opts = {}) {
    const token = await getMagicToken(magicLinkKey)
    if (token) {
      opts.headers = opts.headers || {}
      opts.headers.Authorization = `Bearer ${token}`
    }

    return unfetch(url, opts)
  }

  useEffect(() => {
    loadMagicLink(magicLinkKey).then(
      (sdk) => console.log('sdk', sdk) || setMagic(sdk)
    )
  }, [])

  useEffect(() => {
    if (!currentLoginState) {
      console.log('isLoggedIn')
      isLoggedIn(magicLinkKey)
        .then((loginState) => {
          console.log('isLoggedIn done', loginState)
          setLoggedIn(loginState)
        })
        .then(() => setLoading(false))
    }

    function watchLoggedIn(state) {
      setLoggedIn(state)
    }
    loginEvents.on('loggedIn', watchLoggedIn)

    return () => {
      loginEvents.off('loggedIn', watchLoggedIn)
    }
  }, [currentLoginState])

  return {
    loggedIn,
    loading,
    error,
    loggingIn,
    loggingOut,
    login,
    logout,
    fetch,
    loginEvents,
    magic,
  }
}
