import { createSupabaseServer } from "@/lib/supabase/server";
import { markRead } from "./actions";
import { Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminContactoPage() {
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages = data ?? [];
  const unread = messages.filter((m) => !m.read);
  const read = messages.filter((m) => m.read);

  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-text-strong">Contactos</h1>
        <p className="text-[13.5px] text-text-muted mt-1">
          Mensagens recebidas pelo formulário de contacto do site.
        </p>
      </div>

      {unread.length > 0 && (
        <div>
          <h2 className="text-[15px] font-bold text-text-strong mb-3">
            Não lidas ({unread.length})
          </h2>
          <div className="space-y-3">
            {unread.map((m) => <MessageRow key={m.id} msg={m} />)}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h2 className="text-[15px] font-bold text-text-muted mb-3">
            Lidas ({read.length})
          </h2>
          <div className="space-y-3 opacity-70">
            {read.map((m) => <MessageRow key={m.id} msg={m} />)}
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <p className="text-[14px] text-text-muted">Nenhuma mensagem ainda.</p>
      )}
    </div>
  );
}

function MessageRow({ msg }: { msg: any }) {
  const date = new Date(msg.created_at).toLocaleDateString("pt-PT", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={`bg-white border rounded-2xl p-4 ${!msg.read ? "border-navy-300 shadow-sm" : "border-border-subtle"}`}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13.5px] font-semibold text-text-strong">{msg.name}</span>
            {!msg.read && (
              <span className="text-[11px] bg-navy-800 text-white font-semibold px-2 py-0.5 rounded-full">Nova</span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-1 text-[12px] text-text-muted flex-wrap">
            <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-navy-700">
              <Mail className="w-3 h-3" /> {msg.email}
            </a>
            {msg.phone ? (
              <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-navy-700">
                <Phone className="w-3 h-3" /> {msg.phone}
              </a>
            ) : null}
            <span>{date}</span>
          </div>
          {msg.subject ? (
            <p className="mt-2 text-[12.5px] font-semibold text-text-strong">Assunto: {msg.subject}</p>
          ) : null}
          <p className="mt-2 text-[13px] text-text-strong/85 leading-snug whitespace-pre-line">{msg.message}</p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject ?? "Contacto Your Guide Algarve")}`}
            className="bg-navy-800 hover:bg-navy-900 text-white font-semibold px-3 py-1.5 rounded-lg text-[12.5px] text-center"
          >
            Responder
          </a>
          {!msg.read && (
            <form action={markRead.bind(null, msg.id)}>
              <button type="submit" className="w-full text-[12px] text-text-muted hover:text-text-strong px-3 py-1">
                Marcar lida
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
