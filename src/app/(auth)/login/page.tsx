import { LoginForm } from '@/app/utils/authform/login-form'


const Login = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default Login