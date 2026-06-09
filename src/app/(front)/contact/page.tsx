import type { Metadata } from "next"
import { Mail, Phone, Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import ContactForm from "./contact-form"

export const metadata: Metadata = {
  title: "ติดต่อเรา",
  description: "ติดต่อเราเพื่อสอบถามข้อมูลเพิ่มเติม",
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-bold">ติดต่อเรา</h1>
        <p className="mt-2 text-muted-foreground">
          มีคำถามหรือข้อสงสัย? ส่งข้อความหาเราได้เลย
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <Mail className="size-5 text-primary shrink-0" />
            <span className="text-muted-foreground text-sm">contact@example.com</span>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="size-5 text-primary shrink-0" />
            <span className="text-muted-foreground text-sm">02-123-4567</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="size-5 text-primary shrink-0" />
            <span className="text-muted-foreground text-sm">
              จันทร์ - ศุกร์ 9:00 - 18:00 น.
            </span>
          </div>

          <Separator />

          <p className="text-muted-foreground text-sm leading-relaxed">
            ทีมงานของเราพร้อมให้ความช่วยเหลือคุณในทุกเรื่อง
            ติดต่อเราได้ตามช่องทางด้านบน หรือกรอกแบบฟอร์มเพื่อส่งข้อความโดยตรง
          </p>
        </div>

        <div>
          <ContactForm />
        </div>
      </div>
    </main>
  )
}
