import { TinyFlags } from '../dist/index.js'

// Public flag configuration hosted on GitHub Gist
const flagsUrl =
  'https://gist.githubusercontent.com/fontebasso/d94c363a6c08c817521c34a24f7eca91/raw/950f61d8d4d8265ec58c65cfdc9ccdf6b33d7ec0/flags.json'

// Simulated user context
const userId = 'user123'
const traits = { region: 'us', plan: 'pro' }

async function main() {
  const flags = await TinyFlags.load(flagsUrl, { userId, traits })

  console.log(`User ID: ${userId}`)
  console.log('Is newSidebar enabled?', flags.enabled('newSidebar'))
  console.log('Is v3Checkout enabled?', flags.enabled('v3Checkout'))
}

main().catch(console.error)
