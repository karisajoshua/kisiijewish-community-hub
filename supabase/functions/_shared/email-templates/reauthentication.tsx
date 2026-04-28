/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body, Container, Head, Heading, Hr, Html, Img, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps { token: string }

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Img src={LOGO_URL} alt="Kisii Jewish Community" width="64" height="64" style={logo} />
          <Text style={brand}>Kisii Jewish Community</Text>
        </Section>
        <Section style={card}>
          <Heading style={h1}>Confirm it's you</Heading>
          <Text style={text}>Use the code below to confirm your identity:</Text>
          <Text style={codeStyle}>{token}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            This code expires shortly. If you didn't request this, you can safely ignore this email.
          </Text>
        </Section>
        <Text style={signoff}>B'shalom,<br />The Kisii Jewish Community</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const LOGO_URL = 'https://rppgzflpspsihrqjfzrd.supabase.co/storage/v1/object/public/email-assets/logo.png'
const NAVY = '#172a44'
const main = { backgroundColor: '#ffffff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '560px', margin: '0 auto', padding: '32px 20px' }
const header = { textAlign: 'center' as const, marginBottom: '20px' }
const logo = { display: 'block', margin: '0 auto 8px' }
const brand = { color: NAVY, fontSize: '14px', fontWeight: 600, letterSpacing: '0.04em', margin: 0, textTransform: 'uppercase' as const }
const card = { backgroundColor: '#ffffff', border: '1px solid #e8e2d4', borderRadius: '12px', padding: '32px 28px', textAlign: 'center' as const }
const h1 = { color: NAVY, fontSize: '24px', fontWeight: 700, margin: '0 0 16px' }
const text = { color: '#2c3e50', fontSize: '15px', lineHeight: '1.6', margin: '0 0 16px' }
const codeStyle = { fontFamily: 'Courier, monospace', fontSize: '32px', fontWeight: 'bold' as const, color: NAVY, letterSpacing: '0.2em', margin: '20px 0' }
const hr = { borderColor: '#e8e2d4', margin: '24px 0' }
const footer = { color: '#6b7280', fontSize: '12px', margin: 0 }
const signoff = { color: NAVY, fontSize: '13px', textAlign: 'center' as const, margin: '20px 0 0' }
