import { RegisterForm } from '@/app/utils/authform/register-form'


const Register = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  )
}

export default Register