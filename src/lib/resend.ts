import { Resend } from 'resend'

const resentkey = process.env.RESEND_API_KEY

export const resend = new Resend(resentkey)

export async function resendEmail({
  email,
  token,
}: {
  email: string
  token: string
}) {
  const { data, error } = await resend.emails.send({
    from: 'antoniositoehl@gmail.com',
    to: email,
    subject: 'Reset Password',
    html: generatePasswordRecoveryEmail({ token, email }),
  })

  return { data, error }
}
export function generatePasswordRecoveryEmail({
  token,
  email,
}: {
  token: string
  email: string
}) {
  const recoveryUrl = `https://example.com/password-reset?token=${token}&email=${email}`

  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="color: #333;">Recuperação de Senha</h2>
      <p>Olá,</p>
      <p>Recebemos uma solicitação para redefinir a senha associada ao e-mail <strong>${email}</strong>.</p>
      <p>Se você solicitou a redefinição de senha, clique no link abaixo para continuar:</p>
      <a 
        href="${recoveryUrl}" 
        style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">
        Redefinir Senha
      </a>
      <p>Se você não solicitou essa alteração, pode ignorar este e-mail com segurança.</p>
      <p>Atenciosamente,</p>
      <p>Sua Equipe de Suporte</p>
    </div>
  `
}
