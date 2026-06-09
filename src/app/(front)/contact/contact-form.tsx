"use client"

import { useState, useTransition } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { contactSchema, type ContactFormValues } from "@/lib/validations/contact"
import type { ApiResponse } from "@/types/api"

export default function ContactForm() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [isPending, startTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  })

  function onSubmit(data: ContactFormValues) {
    startTransition(async () => {
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        })

        const json: ApiResponse<unknown> = await res.json()

        if (!json.success) {
          toast.error(json.error)
          return
        }

        form.reset()
        setIsSuccess(true)
      } catch {
        toast.error("เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง")
      }
    })
  }

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle className="size-12 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">ส่งข้อความสำเร็จ</h3>
          <p className="text-muted-foreground text-sm">
            เราได้รับข้อความของคุณแล้ว จะติดต่อกลับโดยเร็วที่สุด
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSuccess(false)}
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form id="form-contact" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-name">ชื่อ</FieldLabel>
              <Input
                {...field}
                id="form-contact-name"
                aria-invalid={fieldState.invalid}
                placeholder="กรอกชื่อของคุณ"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-email">Email</FieldLabel>
              <Input
                {...field}
                id="form-contact-email"
                type="email"
                aria-invalid={fieldState.invalid}
                placeholder="example@email.com"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="form-contact-message">ข้อความ</FieldLabel>
              <textarea
                {...field}
                id="form-contact-message"
                rows={5}
                aria-invalid={fieldState.invalid}
                placeholder="พิมพ์ข้อความที่ต้องการ..."
                className="flex w-full min-w-0 rounded-3xl border border-transparent bg-input/50 px-3 py-2 text-base transition-[color,box-shadow,background-color] outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 resize-none"
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button
        type="submit"
        form="form-contact"
        className="w-full mt-6"
        disabled={isPending}
      >
        {isPending ? "กำลังส่ง..." : "ส่งข้อความ"}
      </Button>
    </form>
  )
}
