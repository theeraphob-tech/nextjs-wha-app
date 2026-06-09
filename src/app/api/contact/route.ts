import { NextResponse } from "next/server"
import { Resend } from "resend"
import { contactSchema } from "@/lib/validations/contact"
import type { ApiResponse } from "@/types/api"

let _resend: Resend | null = null

function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY)
  }
  return _resend
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json()

    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: "ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง" } satisfies ApiResponse<never>,
        { status: 400 }
      )
    }

    const { name, email, message } = parsed.data

    const resend = getResend()

    await resend.emails.send({
      from: `Contact Form <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER_EMAIL!,
      subject: `ข้อความติดต่อจาก ${name}`,
      html: `
        <h2>ข้อความติดต่อใหม่</h2>
        <p><strong>ชื่อ:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>ข้อความ:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    })

    return NextResponse.json(
      { success: true, data: { message: "ส่งข้อความสำเร็จ" } } satisfies ApiResponse<{ message: string }>
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง" } satisfies ApiResponse<never>,
      { status: 500 }
    )
  }
}
