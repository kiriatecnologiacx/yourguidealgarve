import Link from "next/link";
import { ExternalLink, Copy, BookOpen, Sparkles, CircleAlert } from "lucide-react";

export const metadata = { title: "Ajuda — YouGuideAlgarve admin" };

export default function AdminHelpPage() {
  return (
    <div className="px-6 lg:px-10 py-8 max-w-4xl">
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-brand-orange" />
        <h1 className="text-2xl font-extrabold text-text-strong">Como cadastrar passeios</h1>
      </div>
      <p className="text-[13.5px] text-text-muted mt-1 max-w-2xl">
        Guia rápido para pegar o widget de cada sistema de reservas e colar no
        admin. Foi pensado para você só precisar de 2 minutos por passeio.
      </p>

      <section className="mt-8 bg-white border border-border-subtle rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-orange" />
          <h2 className="text-[15px] font-bold text-text-strong">Fluxo geral</h2>
        </div>
        <ol className="text-[14px] text-text-strong/90 space-y-2 list-decimal pl-5 marker:text-brand-orange marker:font-bold">
          <li>Entre no painel do parceiro (Rezdy, FareHarbor ou Pluralo) e gere o widget do passeio.</li>
          <li>
            Copie a <strong>URL do iframe</strong> (recomendado) ou o snippet HTML completo.
          </li>
          <li>
            No admin do site, abra{" "}
            <Link href="/admin/passeios/novo" className="text-navy-700 underline hover:text-navy-900">
              Passeios → Novo passeio
            </Link>
            , preencha título + imagem de capa + cole o widget. Salve.
          </li>
          <li>
            Pronto. A página pública renderiza o widget do parceiro ocupando o conteúdo principal — foto, descrição, calendário e botão de reserva vêm dele. O resto do site (header, footer, cards) é nosso.
          </li>
        </ol>
        <div className="mt-2 flex items-start gap-2 text-[12.5px] text-text-muted bg-surface-alt p-3 rounded-lg">
          <CircleAlert className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <p>
            Se você colar o snippet inteiro <code>&lt;iframe src=&quot;...&quot;&gt;...&lt;/iframe&gt;</code>{" "}
            no campo de URL, o sistema extrai a URL automaticamente. Pode colar como vier.
          </p>
        </div>
      </section>

      {/* REZDY */}
      <section id="rezdy" className="mt-6 bg-white border border-border-subtle rounded-2xl p-6 space-y-3">
        <header className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[16px] font-bold text-text-strong">Rezdy</h2>
          <a
            href="https://app.rezdy.com/bookingform/widgetPlugins"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] text-navy-700 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            Abrir Rezdy <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>
        <ol className="text-[14px] text-text-strong/90 space-y-2 list-decimal pl-5 marker:text-brand-orange marker:font-bold">
          <li>
            No menu lateral, vá em{" "}
            <strong>Sell Online → Widgets</strong>.
          </li>
          <li>
            Em <strong>Select Plugin</strong>, escolha <strong>Product Details</strong>{" "}
            (essa é a página completa do passeio).
          </li>
          <li>
            Em <strong>Select a Product</strong>, escolha o passeio que você quer publicar.
          </li>
          <li>
            Clique em <strong>Copy to Clipboard</strong> no topo. O snippet copiado se parece com:
            <pre className="mt-2 text-[11.5px] bg-navy-900 text-white/90 p-3 rounded-lg overflow-auto leading-snug">
{`<script defer src="https://yourguidealgarve.rezdy.com/pluginJs"></script>
<iframe seamless width="100%" height="1000px" frameborder="0"
  class="rezdy"
  src="https://yourguidealgarve.rezdy.com/45975J/buggy-adventure-1-5h-off-road-tour-from-albufeira?iframe=true">
</iframe>`}
            </pre>
          </li>
          <li>
            No admin, cole no campo <strong>URL do widget</strong> (a gente extrai a URL automaticamente do snippet).
          </li>
        </ol>
        <div className="mt-2 flex items-start gap-2 text-[12.5px] text-text-muted bg-surface-alt p-3 rounded-lg">
          <Copy className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <p>
            Dica: se preferir, copie só a URL que aparece dentro do{" "}
            <code>src=&quot;...&quot;</code> (do snippet) — ela já basta.
          </p>
        </div>
      </section>

      {/* FAREHARBOR */}
      <section id="fareharbor" className="mt-6 bg-white border border-border-subtle rounded-2xl p-6 space-y-3">
        <header className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[16px] font-bold text-text-strong">FareHarbor</h2>
          <a
            href="https://fareharbor.com/help/articles/getting-started-with-light-frames-and-flow-buttons/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] text-navy-700 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            Docs FareHarbor <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>
        <ol className="text-[14px] text-text-strong/90 space-y-2 list-decimal pl-5 marker:text-brand-orange marker:font-bold">
          <li>
            Entre no <strong>Dashboard FareHarbor</strong> da sua conta de afiliado.
          </li>
          <li>
            Vá em <strong>Settings → Widgets</strong> (ou Tools → Widgets, dependendo da versão).
          </li>
          <li>
            Escolha o tipo de widget <strong>Inline / iFrame</strong> e selecione o passeio.
          </li>
          <li>
            Copie o snippet. Geralmente tem essa forma:
            <pre className="mt-2 text-[11.5px] bg-navy-900 text-white/90 p-3 rounded-lg overflow-auto leading-snug">
{`<script src="https://fareharbor.com/embeds/api/v1/?autolightframe=yes&fallback=simple&full-items=yes"></script>
<div data-fareharbor-shortname="your-company"
     data-fareharbor-item="123456">
</div>`}
            </pre>
          </li>
          <li>
            No admin, como o FareHarbor depende do <code>&lt;script&gt;</code>, cole o snippet inteiro no campo <strong>HTML completo do snippet</strong> (não no campo URL).
          </li>
        </ol>
        <div className="mt-2 flex items-start gap-2 text-[12.5px] text-text-muted bg-surface-alt p-3 rounded-lg">
          <CircleAlert className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <p>
            O FareHarbor injeta o widget via JavaScript, por isso precisa do HTML
            completo (com a tag <code>&lt;script&gt;</code>). A gente renderiza
            num iframe sandbox que executa o script com segurança.
          </p>
        </div>
      </section>

      {/* PLURALO */}
      <section id="pluralo" className="mt-6 bg-white border border-border-subtle rounded-2xl p-6 space-y-3">
        <header className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-[16px] font-bold text-text-strong">Pluralo</h2>
          <a
            href="https://app.pluralo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12.5px] text-navy-700 font-semibold inline-flex items-center gap-1 hover:underline"
          >
            Abrir Pluralo <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </header>
        <ol className="text-[14px] text-text-strong/90 space-y-2 list-decimal pl-5 marker:text-brand-orange marker:font-bold">
          <li>
            No painel Pluralo, vá em <strong>Distribuição → Widgets / Booking Engine</strong>.
          </li>
          <li>
            Escolha o widget tipo <strong>Página do produto / iFrame</strong> e selecione o passeio.
          </li>
          <li>
            Copie a <strong>URL do iframe</strong> ou o snippet HTML completo gerado.
          </li>
          <li>
            No admin, cole no campo apropriado (URL se for só link de iframe, HTML se tiver{" "}
            <code>&lt;script&gt;</code>).
          </li>
        </ol>
        <div className="mt-2 flex items-start gap-2 text-[12.5px] text-text-muted bg-surface-alt p-3 rounded-lg">
          <CircleAlert className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
          <p>
            O nome dos menus pode variar dependendo da versão. Se não achar, me
            avisa que eu ajusto este guia com o caminho exato da sua conta.
          </p>
        </div>
      </section>

      <section className="mt-6 bg-navy-800 text-white rounded-2xl p-6">
        <h2 className="text-[16px] font-bold">E os textos / fotos do passeio?</h2>
        <p className="text-[13.5px] text-white/85 mt-2">
          Quando você cola um widget, a página pública já mostra a foto,
          descrição, calendário e botão de reserva diretamente do parceiro — não
          precisa preencher esses campos no admin.
        </p>
        <p className="text-[13.5px] text-white/85 mt-2">
          Você só precisa preencher:
        </p>
        <ul className="mt-2 list-disc pl-5 text-[13.5px] text-white/85 space-y-1">
          <li><strong>Título</strong> — usado nos cards da home, listagem e SEO.</li>
          <li><strong>Imagem de capa</strong> — usada nos cards (o widget já mostra suas fotos próprias).</li>
          <li><strong>Categoria / Destino</strong> — para filtros e a seção &quot;Destinos em destaque&quot;.</li>
        </ul>
        <p className="text-[13.5px] text-white/85 mt-3">
          O bloco &quot;Conteúdo extra&quot; do form é todo opcional — só preencha se
          quiser complementar com informações editoriais (descrição própria,
          galeria custom, destaques) que apareçam{" "}
          <em>além</em> do widget.
        </p>
      </section>
    </div>
  );
}
