MFA CLI
-------------------

Saving and managing 2FA secrets and then getting the tokens are quite annoying,
so this is my quick and easy fix. It's really easy to use, and convenient!

#### Installation

```bash
npm i -g mfa
```

#### Setting up a new service

1. Copy the secret key from the service, let's call the service `example`.
2. Then, go to terminal and do:

```bash
mfa save example
```

That's it! Now, you can get the 2FA from now on like so.


#### Getting the token

```bash
mfa example
```

This will copy the token to your clipboard.

#### Listing your saved services

```bash
mfa ls
```

