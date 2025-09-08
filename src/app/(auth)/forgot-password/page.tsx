import ForgotPasswordForm from '@/app/utils/authform/forgot-passform'


const ForgotPassword = () => {
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className="w-full max-w-sm md:max-w-3xl">
        <ForgotPasswordForm />
      </div>
    </div>
  )
}

export default ForgotPassword