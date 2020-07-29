import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import { withApollo } from '../lib/withApollo'

const QuestionsPage = ({ auth }) => {
  const [email, setEmail] = useState('')

  async function save(event) {
    event.preventDefault()
    auth.login(email)
  }

  if (auth.loggedIn) {
    // todo save localstorage
    Router.push(`/`)
  }

  return (
    <>
      <h2>Yes / No / Maybe</h2>
      <p>Save and share your answers</p>

      <form noValidate autoComplete="off" onSubmit={save}>
        <TextField
          id="email"
          label="Email"
          variant="outlined"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        ;
        <Button type="submit" variant="contained" color="primary">
          Save
        </Button>
      </form>

      <p>
        Or <Link href="/questions/4">answer more!</Link>
      </p>
    </>
  )
}

export default withApollo({ ssr: true })(QuestionsPage)
