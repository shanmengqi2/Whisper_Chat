import './App.css'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { SignInButton } from '@clerk/clerk-react'
import { SignUpButton } from '@clerk/clerk-react'
import { UserButton } from '@clerk/clerk-react'

function App() {

  return (
    <>
      <h1>heelo world</h1>
      <SignedOut>
        <SignInButton mode='modal' />
        <SignUpButton mode='modal' />
      </SignedOut>
      {/* Show the user button when the user is signed in */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  )
}

export default App
