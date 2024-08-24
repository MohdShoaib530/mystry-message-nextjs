import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/VerificatioEmail';
import { apiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<apiResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: email,
      subject: 'verification code mystrymessage',
      react: VerificationEmail({ username, otp: verifyCode })
    });
    return {
      success: true,
      message: 'Verification email sent'
    };
  } catch (error) {
    console.log('Error sending verification email', error);
    return {
      success: false,
      message: 'Could not send verification email'
    };
  }
}
