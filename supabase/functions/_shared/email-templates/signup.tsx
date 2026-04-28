/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Button, Container, Head, Heading, Hr, Html, Img, Link, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({ siteName, siteUrl, recipient, confirmationUrl }: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Shalom — confirm your email to join Kisii Jewish Community</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={LOGO_URL} alt="Kisii Jewish Community" width="64" height="64" style={logo} />
          <Text style={brand}>Kisii Jewish Community</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Shalom, and welcome 🤍</Heading>
          <Text style={text}>
            Thank you for joining the <strong>Kisii Jewish Community</strong> family. To complete your
            sign‑up for <Link href={siteUrl} style={link}>{siteName}</Link>, please confirm the email
            address <strong>{recipient}</strong>.
          </Text>
          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Button style={button} href={confirmationUrl}>Verify my email</Button>
          </Section>
          <Text style={small}>
            If the button doesn't work, copy and paste this link into your browser:
            <br />
            <Link href={confirmationUrl} style={link}>{confirmationUrl}</Link>
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            If you didn't create an account with us, you can safely ignore this email.
          </Text>
        </Section>
        <Text style={signoff}>B'shalom,<br />The Kisii Jewish Community</Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

const LOGO_URL = 'https://rppgzflpspsihrqjfzrd.supabase.co/storage/v1/object/public/email-assets/logo.png'
const NAVY = '#172a44'
const SKY = '#1FA8F2'

const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 20px' }
const header = { textAlign: 'center' as const, marginBottom: '20px' }
const logo = { display: 'block', margin: '0 auto 8px' }
const brand = { color: NAVY, fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' as const }
const card = { backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '12px', padding: '32px 28px' }
const h1 = { color: NAVY, fontSize: '24px', fontWeight: 700, margin: '0 0 16px' }
const text = { color: '#2c3e50', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }
const small = { color: '#6b7280', fontSize: '12px', lineHeight: '1.5', margin: '16px 0 0', wordBreak: 'break-all' as const }
const link = { color: SKY, textDecoration: 'underline' }
const button = { backgroundColor: SKY, color: '#ffffff', fontSize: '15px', fontWeight: 600, borderRadius: '8px', padding: '14px 28px', textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e8e2d4', margin: '24px 0' }
const footer = { color: '#6b7280', fontSize: '12px', margin: 0 }
const signoff = { color: NAVY, fontSize: '13px', textAlign: 'center' as const, margin: '20px 0 0' }
