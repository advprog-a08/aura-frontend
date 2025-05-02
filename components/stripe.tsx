"use client"

import type { ReactNode } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Mock Stripe public key - in a real app, this would be an environment variable
const stripePromise = loadStripe("pk_test_mock_key")

interface StripeProps {
  children: ReactNode
}

export function Stripe({ children }: StripeProps) {
  return <Elements stripe={stripePromise}>{children}</Elements>
}
