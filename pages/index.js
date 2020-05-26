import InfoBox from '../components/InfoBox'
import Header from '../components/Header'
import PostList from '../components/PostList'
import { withApollo } from '../lib/withApollo'

const IndexPage = ({ auth }) => {
  function loginNow() {
    const email = prompt('Enter your email')

    if (email) {
      auth.login(email)
    }
  }

  function getContent() {
    console.log(auth, typeof window)
    if (auth.loading || auth.loggingIn || auth.loggingOut) {
      return '...'
    }

    if (auth.loggedIn) {
      return (
        <div>
          Logged in
          <br />
          <button onClick={() => auth.logout()}>Logout</button>
        </div>
      )
    }

    return (
      <div>
        <button onClick={loginNow}>Login Now</button>
      </div>
    )
  }

  return (
    <>
      <Header />
      <InfoBox>
        ℹ️ This example shows how to fetch all initial apollo queries on the
        server. If you <a href="/">reload</a> this page you won't see a loader
        since Apollo fetched all needed data on the server. This prevents{' '}
        <a
          href="https://nextjs.org/blog/next-9#automatic-static-optimization"
          target="_blank"
          rel="noopener noreferrer"
        >
          automatic static optimization
        </a>{' '}
        in favour of full Server-Side-Rendering.
      </InfoBox>
      {getContent()}
      <PostList />
    </>
  )
}

export default withApollo({ ssr: true })(IndexPage)
