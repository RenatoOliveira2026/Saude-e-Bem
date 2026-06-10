import { WhatsAppCaptureButton } from "./WhatsAppCaptureButton";

interface WhatsAppCaptureSectionProps {
  title?: string;
  description?: string;
  message?: string;
  buttonLabel?: string;
}

export function WhatsAppCaptureSection({
  title = "Prefere WhatsApp?",
  description = "Fale conosco ou deixe seu telefone no formulário acima com opt-in para receber dicas personalizadas.",
  message,
  buttonLabel = "Abrir conversa no WhatsApp",
}: WhatsAppCaptureSectionProps) {
  return (
    <div className="mt-8 rounded-2xl border border-[#25D366]/30 bg-[#25D366]/5 p-6 text-center">
      <p className="font-heading text-lg text-forest">{title}</p>
      <p className="mt-2 text-sm text-muted text-pretty">{description}</p>
      <div className="mt-4 flex justify-center">
        <WhatsAppCaptureButton
          message={message}
          label={buttonLabel}
          buttonType="capture_section"
          className="inline-flex items-center justify-center rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
        />
      </div>
    </div>
  );
}
