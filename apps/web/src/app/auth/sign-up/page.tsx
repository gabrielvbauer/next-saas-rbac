import { useRouter } from 'next/navigation'

import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword } from '../sign-in/actions'
import { SignUpForm } from './sign-up-form'

export default function SignUpPage() {
  const router = useRouter()

  const [{ success, message, errors }, handleSubmit, isPending] = useFormState(
    signInWithEmailAndPassword,
    () => {
      router.push('/')
    },
  )

  return <SignUpForm />
}
