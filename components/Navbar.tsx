import { useOutletContext } from 'react-router'
import { Box } from 'lucide-react'
import Button from './ui/Button'

const Navbar = () => {
  const { isSignedIn, userName, signIn, signOut } = useOutletContext<AuthContext>()

  const handleAuthClick = async () => {
    if (isSignedIn) {
      try {
        await signOut()
      } catch (error) {
        console.error(`Puter sign out failed: ${error}`)
      }

      return
    }

    try {
      await signIn()
    } catch (error) {
      console.error(`Puter sign in failed: ${error}`)
    }
  }

  return (
    <header className="navbar">
      <nav className="inner">
        <div className="left">
          <div className="brand">
            <Box className="logo" />
            <span className="name">Roomify</span>
          </div>

          <ul className="links">
            <a href="#">Product</a>
            <a href="#">Pricing</a>
            <a href="#">Community</a>
            <a href="#">Enterprise</a>
          </ul>
        </div>

        <div className="actions">
          {isSignedIn ? (
            <>
              <span className="greeting">
                {userName ? `Hi, ${userName}` : 'Signed In'}
              </span>

              <Button
                className="btn" type="button"
                size="sm" onClick={handleAuthClick}
              >
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                className="login" type="button"
                size="sm" variant="ghost"
                onClick={handleAuthClick}
              >
                Log In
              </Button>

              <a className="cta" href="#upload">Get Started</a>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Navbar