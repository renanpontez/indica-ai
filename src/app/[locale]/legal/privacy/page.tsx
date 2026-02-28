import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import LandingNavbar from '@/components/LandingNavbar';
import { routes, type Locale } from '@/lib/routes';

interface PrivacyPageProps {
  params: Promise<{ locale: Locale }>;
}

const content = {
  'pt-BR': {
    title: 'Política de Privacidade e Termos de Uso',
    lastUpdated: 'Efetiva a partir de 27 de Fevereiro de 2026',
    backToHome: 'Voltar para o início',
    privacyTitle: 'Política de Privacidade',
    termsTitle: 'Termos de Uso',
    privacySections: [
      {
        title: '',
        content:
          'O Circle Picks ("nós", "nosso") respeita a sua privacidade e está comprometido em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, compartilhamos e protegemos suas informações quando você utiliza o site circlepicks.app e o aplicativo móvel Circle Picks (coletivamente, o "Serviço"). Ao utilizar o Serviço, você concorda com as práticas descritas nesta política.',
      },
      {
        title: 'Informações Pessoais que Coletamos',
        content:
          'Coletamos diferentes tipos de informações para fornecer e melhorar nosso Serviço:',
        list: [
          'Informações do dispositivo: tipo de navegador, endereço IP, fuso horário, cookies, páginas visualizadas, termos de busca, como você interage com o Serviço e dados de referência',
          'Informações da conta: endereço de email, nome e nome de exibição, nome de usuário e foto de perfil (opcional), fornecidos ao criar sua conta',
          'Dados de uso: lugares e experiências compartilhados, tags utilizadas, fotos enviadas, favoritos (bookmarks), usuários que você segue e localização GPS (quando permitido por você)',
        ],
      },
      {
        title: 'Tecnologias de Coleta',
        content:
          'Utilizamos as seguintes tecnologias para coletar informações automaticamente:',
        list: [
          'Cookies de sessão de autenticação do Supabase, necessários para manter você conectado à sua conta',
          'Umami Analytics, uma ferramenta de análise focada em privacidade que, por padrão, não utiliza cookies e não coleta dados pessoais identificáveis',
          'Arquivos de log do servidor, que podem registrar informações como endereço IP, tipo de navegador e páginas acessadas',
        ],
      },
      {
        title: 'Como Usamos Suas Informações',
        content: 'Utilizamos as informações coletadas para os seguintes fins:',
        list: [
          'Fornecer, operar e manter o Serviço',
          'Gerenciar sua conta e autenticação',
          'Exibir suas recomendações para sua rede de contatos e, quando aplicável, para a comunidade',
          'Melhorar e otimizar a plataforma por meio de análises de uso',
          'Comunicar-nos com você sobre assuntos relacionados à sua conta',
          'Garantir a segurança da plataforma e prevenir fraudes',
        ],
      },
      {
        title: 'Compartilhamento de Informações',
        content:
          'Não vendemos, alugamos ou comercializamos seus dados pessoais. Podemos compartilhar suas informações nos seguintes casos:',
        list: [
          'Supabase: infraestrutura de banco de dados e autenticação, onde seus dados são armazenados e processados',
          'Google Sign-In e Apple Sign-In: utilizados como provedores de autenticação para login na plataforma; recebemos apenas informações básicas de perfil (nome e email) necessárias para criar sua conta',
          'Google Places API: utilizado para busca de lugares quando você adiciona experiências; dados de busca são enviados ao Google',
          'Umami Analytics: coleta dados anonimizados de uso para fins de análise',
          'Sentry: serviço de monitoramento de erros que coleta informações técnicas (como stack traces e dados do dispositivo) para identificar e corrigir problemas na plataforma; não coleta dados pessoais identificáveis intencionalmente',
          'Requisitos legais: podemos divulgar suas informações se exigido por lei, ordem judicial ou processo legal',
        ],
      },
      {
        title: 'Cookies',
        content:
          'Utilizamos apenas cookies essenciais para o funcionamento do Serviço. Cookies de sessão do Supabase são necessários para autenticação e manutenção da sua sessão. O Umami Analytics é configurado para funcionar sem cookies, respeitando a privacidade dos usuários. Não utilizamos cookies de publicidade ou rastreamento de terceiros.',
      },
      {
        title: 'Retenção de Dados',
        content:
          'Mantemos suas informações pessoais enquanto sua conta estiver ativa. Se você solicitar a exclusão da sua conta, removeremos seus dados pessoais de nossos sistemas dentro de 30 (trinta) dias corridos, exceto quando a retenção for necessária para cumprir obrigações legais, resolver disputas ou fazer cumprir nossos acordos.',
      },
      {
        title: 'Seus Direitos',
        content:
          'Dependendo da sua localização, você possui direitos específicos sobre seus dados pessoais:',
        list: [
          'Acessar os dados pessoais que mantemos sobre você',
          'Corrigir informações pessoais imprecisas ou incompletas',
          'Solicitar a exclusão dos seus dados pessoais e da sua conta',
          'Exportar seus dados em formato portátil',
          'Revogar o consentimento para o tratamento de dados a qualquer momento',
        ],
      },
      {
        title: 'Residentes no Brasil (LGPD)',
        content:
          'Se você reside no Brasil, a Lei Geral de Proteção de Dados (LGPD) garante direitos adicionais, incluindo o direito de solicitar informações sobre o tratamento dos seus dados, portabilidade, anonimização, bloqueio ou eliminação de dados desnecessários e o direito de peticionar à Autoridade Nacional de Proteção de Dados (ANPD). Para exercer esses direitos, entre em contato conosco pelo email hello@circlepicks.app.',
      },
      {
        title: 'Residentes na Europa (GDPR)',
        content:
          'Se você reside no Espaço Econômico Europeu (EEE), o Regulamento Geral de Proteção de Dados (GDPR) garante direitos adicionais, incluindo o direito à portabilidade de dados, restrição de processamento e o direito de apresentar uma reclamação junto à autoridade supervisora local. A base legal para o processamento de seus dados é o consentimento e o interesse legítimo em fornecer o Serviço.',
      },
      {
        title: 'Segurança dos Dados',
        content:
          'Adotamos medidas de segurança comercialmente razoáveis para proteger suas informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. Isso inclui criptografia de dados em trânsito, políticas de Row Level Security (RLS) no banco de dados para garantir que usuários só acessem seus próprios dados e armazenamento seguro de credenciais. Nenhum método de transmissão pela Internet ou armazenamento eletrônico é 100% seguro, mas nos esforçamos para proteger seus dados.',
      },
      {
        title: 'Do Not Track',
        content:
          'Respeitamos sinais de Do Not Track (DNT) enviados pelo seu navegador. Quando detectamos um sinal DNT, não coletamos dados de navegação para fins de análise. O Umami Analytics, por ser uma ferramenta focada em privacidade, já opera de forma compatível com essas preferências.',
      },
      {
        title: 'Dados de Menores',
        content:
          'O Serviço não é destinado a pessoas com menos de 13 anos de idade. Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. Se tomarmos conhecimento de que coletamos dados de uma criança menor de 13 anos, tomaremos medidas para excluir essas informações de nossos servidores dentro de 30 dias. Se você é pai, mãe ou responsável e acredita que seu filho nos forneceu dados pessoais, entre em contato pelo email hello@circlepicks.app para que possamos tomar as providências necessárias.',
      },
      {
        title: 'Links para Serviços de Terceiros',
        content:
          'O Serviço pode conter links para sites ou serviços de terceiros, como perfis do Instagram de estabelecimentos, Google Maps e outros. Esses links são fornecidos apenas para conveniência e informação. Não somos responsáveis pelas práticas de privacidade ou pelo conteúdo desses sites ou serviços de terceiros. Recomendamos que você revise as políticas de privacidade de qualquer site de terceiros que visitar.',
      },
      {
        title: 'Alterações nesta Política',
        content:
          'Podemos atualizar esta Política de Privacidade periodicamente para refletir mudanças em nossas práticas ou por outros motivos operacionais, legais ou regulatórios. A versão atualizada será publicada nesta página com uma nova data de vigência. Recomendamos que você revise esta página regularmente para se manter informado.',
      },
    ],
    termsSections: [
      {
        title: 'Aceitação dos Termos',
        content:
          'Ao acessar ou utilizar o Circle Picks ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá acessar ou utilizar o Serviço. Estes termos constituem um acordo legal entre você e o Circle Picks.',
      },
      {
        title: 'Descrição do Serviço',
        content:
          'O Circle Picks é uma plataforma social que permite aos usuários compartilhar e descobrir recomendações de lugares como restaurantes, bares, cafés, hotéis e outras experiências. Os usuários podem publicar experiências, seguir outros usuários, salvar recomendações e explorar sugestões da sua rede de amigos e da comunidade.',
      },
      {
        title: 'Conta do Usuário',
        content: 'Para criar e manter uma conta no Serviço, você declara e garante que:',
        list: [
          'Tem pelo menos 13 anos de idade',
          'Fornecerá informações verdadeiras, precisas e completas durante o cadastro',
          'Manterá a segurança e confidencialidade da sua senha',
          'É responsável por todas as atividades realizadas com sua conta',
          'Notificará o Circle Picks imediatamente sobre qualquer uso não autorizado ou violação de segurança da sua conta',
        ],
      },
      {
        title: 'Conteúdo do Usuário',
        content:
          'Você mantém todos os direitos de propriedade intelectual sobre o conteúdo que cria e compartilha no Circle Picks, incluindo experiências, fotos, descrições e comentários. Ao publicar conteúdo, você concede ao Circle Picks uma licença mundial, não exclusiva, isenta de royalties e transferível para usar, exibir, reproduzir e distribuir esse conteúdo exclusivamente no âmbito da operação do Serviço. Essa licença se encerra quando você exclui o conteúdo ou sua conta.',
      },
      {
        title: 'Controles de Visibilidade',
        content:
          'O Circle Picks oferece controles de visibilidade para suas experiências. Você pode definir suas publicações como públicas (visíveis para todos os usuários) ou restritas a amigos (visíveis apenas para quem você segue e que segue você). Você é responsável por gerenciar suas configurações de visibilidade. O Circle Picks não se responsabiliza por conteúdo compartilhado por terceiros que tenham acesso legítimo às suas publicações.',
      },
      {
        title: 'Conduta Proibida',
        content: 'Ao utilizar o Serviço, você concorda em NÃO:',
        list: [
          'Publicar conteúdo falso, enganoso, difamatório ou ofensivo sobre lugares ou pessoas',
          'Violar direitos de propriedade intelectual, marcas registradas ou direitos autorais de terceiros',
          'Utilizar o Serviço para qualquer fim ilegal ou não autorizado',
          'Enviar spam, mensagens não solicitadas ou publicidade',
          'Realizar scraping, crawling ou coleta automatizada de dados da plataforma',
          'Assediar, intimidar ou ameaçar outros usuários',
          'Tentar acessar contas de outros usuários ou sistemas internos do Circle Picks',
          'Introduzir vírus, malware ou código malicioso no Serviço',
        ],
      },
      {
        title: 'Propriedade Intelectual',
        content:
          'A marca Circle Picks, incluindo logotipos, design visual, interface e tecnologia da plataforma, é de propriedade exclusiva do Circle Picks. Nada nestes Termos concede a você qualquer direito sobre nossa propriedade intelectual. Você não pode copiar, modificar, distribuir ou utilizar nossa marca ou elementos visuais sem autorização prévia por escrito.',
      },
      {
        title: 'Limitação de Responsabilidade',
        content:
          'O Serviço é fornecido "como está" e "conforme disponível", sem garantias de qualquer tipo, expressas ou implícitas. O Circle Picks não garante que o Serviço será ininterrupto, seguro ou livre de erros. Não somos responsáveis por decisões tomadas com base em recomendações de outros usuários. Recomendações refletem opiniões pessoais dos usuários e não representam endosso do Circle Picks. Na máxima extensão permitida por lei, o Circle Picks não será responsável por danos indiretos, incidentais, especiais ou consequentes.',
      },
      {
        title: 'Modificações do Serviço',
        content:
          'Reservamos o direito de modificar, suspender ou descontinuar o Serviço, total ou parcialmente, a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis perante você ou terceiros por qualquer modificação, suspensão ou descontinuação do Serviço.',
      },
      {
        title: 'Encerramento',
        content:
          'O Circle Picks pode suspender ou encerrar sua conta a qualquer momento, com ou sem aviso prévio, caso você viole estes Termos ou por qualquer outro motivo a nosso critério. Você pode encerrar sua conta a qualquer momento entrando em contato conosco pelo email hello@circlepicks.app. Após o encerramento, seu direito de usar o Serviço cessará imediatamente.',
      },
      {
        title: 'Lei Aplicável',
        content:
          'Estes Termos são regidos e interpretados de acordo com as leis da República Federativa do Brasil. Qualquer disputa será submetida ao foro da comarca de São Paulo/SP, Brasil, com renúncia a qualquer outro, por mais privilegiado que seja. Este Serviço está em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
      },
      {
        title: 'Alterações nos Termos',
        content:
          'Podemos atualizar estes Termos de Uso periodicamente. Quando fizermos alterações significativas, notificaremos você por meio do Serviço ou por email. A versão atualizada será publicada nesta página com uma nova data de vigência. O uso continuado do Serviço após a publicação das alterações constitui aceitação dos novos termos.',
      },
    ],
    contact: {
      title: 'Contato',
      content:
        'Se você tiver dúvidas sobre esta Política de Privacidade, Termos de Uso, ou sobre como tratamos seus dados pessoais, entre em contato conosco pelo email: hello@circlepicks.app',
    },
  },
  'en-US': {
    title: 'Privacy Policy and Terms of Use',
    lastUpdated: 'Effective as of February 27, 2026',
    backToHome: 'Back to home',
    privacyTitle: 'Privacy Policy',
    termsTitle: 'Terms of Use',
    privacySections: [
      {
        title: '',
        content:
          'Circle Picks ("we", "our", "us") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, share, and protect your information when you use the circlepicks.app website and the Circle Picks mobile application (collectively, the "Service"). By using the Service, you agree to the practices described in this policy.',
      },
      {
        title: 'Personal Information We Collect',
        content:
          'We collect different types of information to provide and improve our Service:',
        list: [
          'Device information: browser type, IP address, time zone, cookies, pages viewed, search terms, how you interact with the Service, and referral data',
          'Account information: email address, name and display name, username, and profile photo (optional), provided when you create your account',
          'Usage data: places and experiences shared, tags used, photos uploaded, bookmarks, users you follow, and GPS location (when permitted by you)',
        ],
      },
      {
        title: 'Collection Technologies',
        content:
          'We use the following technologies to collect information automatically:',
        list: [
          'Supabase authentication session cookies, required to keep you signed in to your account',
          'Umami Analytics, a privacy-focused analytics tool that does not use cookies by default and does not collect personally identifiable data',
          'Server log files, which may record information such as IP address, browser type, and pages accessed',
        ],
      },
      {
        title: 'How We Use Your Information',
        content: 'We use the information we collect for the following purposes:',
        list: [
          'Provide, operate, and maintain the Service',
          'Manage your account and authentication',
          'Display your recommendations to your network and, where applicable, to the community',
          'Improve and optimize the platform through usage analytics',
          'Communicate with you about account-related matters',
          'Ensure platform security and prevent fraud',
        ],
      },
      {
        title: 'Sharing Your Information',
        content:
          'We do not sell, rent, or trade your personal data. We may share your information in the following cases:',
        list: [
          'Supabase: database infrastructure and authentication, where your data is stored and processed',
          'Google Sign-In and Apple Sign-In: used as authentication providers for platform login; we only receive basic profile information (name and email) necessary to create your account',
          'Google Places API: used for place search when you add experiences; search data is sent to Google',
          'Umami Analytics: collects anonymized usage data for analysis purposes',
          'Sentry: error monitoring service that collects technical information (such as stack traces and device data) to identify and fix platform issues; it does not intentionally collect personally identifiable data',
          'Legal requirements: we may disclose your information if required by law, court order, or legal process',
        ],
      },
      {
        title: 'Cookies',
        content:
          'We use only essential cookies for the operation of the Service. Supabase session cookies are required for authentication and maintaining your session. Umami Analytics is configured to operate without cookies, respecting user privacy. We do not use advertising or third-party tracking cookies.',
      },
      {
        title: 'Data Retention',
        content:
          'We retain your personal information for as long as your account is active. If you request account deletion, we will remove your personal data from our systems within 30 (thirty) calendar days, except where retention is necessary to comply with legal obligations, resolve disputes, or enforce our agreements.',
      },
      {
        title: 'Your Rights',
        content:
          'Depending on your location, you have specific rights regarding your personal data:',
        list: [
          'Access the personal data we hold about you',
          'Correct inaccurate or incomplete personal information',
          'Request deletion of your personal data and account',
          'Export your data in a portable format',
          'Withdraw consent for data processing at any time',
        ],
      },
      {
        title: 'For Brazilian Residents (LGPD)',
        content:
          'If you reside in Brazil, the General Data Protection Law (LGPD) provides additional rights, including the right to request information about data processing, data portability, anonymization, blocking or deletion of unnecessary data, and the right to petition the National Data Protection Authority (ANPD). To exercise these rights, contact us at hello@circlepicks.app.',
      },
      {
        title: 'For European Residents (GDPR)',
        content:
          'If you reside in the European Economic Area (EEA), the General Data Protection Regulation (GDPR) provides additional rights, including the right to data portability, restriction of processing, and the right to lodge a complaint with your local supervisory authority. The legal basis for processing your data is consent and the legitimate interest in providing the Service.',
      },
      {
        title: 'Data Security',
        content:
          'We employ commercially reasonable security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit, Row Level Security (RLS) policies at the database level to ensure users can only access their own data, and secure credential storage. No method of transmission over the Internet or electronic storage is 100% secure, but we strive to protect your data.',
      },
      {
        title: 'Do Not Track',
        content:
          'We respect Do Not Track (DNT) signals sent by your browser. When we detect a DNT signal, we do not collect browsing data for analytics purposes. Umami Analytics, being a privacy-focused tool, already operates in a manner compatible with these preferences.',
      },
      {
        title: "Children's Data",
        content:
          'The Service is not intended for individuals under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected data from a child under 13, we will take steps to delete that information from our servers within 30 days. If you are a parent or guardian and believe your child has provided us with personal data, please contact us at hello@circlepicks.app so we can take appropriate action.',
      },
      {
        title: 'Links to Third-Party Services',
        content:
          'The Service may contain links to third-party websites or services, such as Instagram profiles of establishments, Google Maps, and others. These links are provided solely for convenience and information. We are not responsible for the privacy practices or content of these third-party websites or services. We encourage you to review the privacy policies of any third-party sites you visit.',
      },
      {
        title: 'Changes to This Policy',
        content:
          'We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. The updated version will be posted on this page with a new effective date. We encourage you to review this page regularly to stay informed.',
      },
    ],
    termsSections: [
      {
        title: 'Acceptance of Terms',
        content:
          'By accessing or using Circle Picks ("Service"), you agree to comply with and be bound by these Terms of Use. If you do not agree to any part of these terms, you must not access or use the Service. These terms constitute a legal agreement between you and Circle Picks.',
      },
      {
        title: 'Service Description',
        content:
          'Circle Picks is a social platform that allows users to share and discover recommendations for places such as restaurants, bars, cafes, hotels, and other experiences. Users can publish experiences, follow other users, save recommendations, and explore suggestions from their network of friends and the community.',
      },
      {
        title: 'User Account',
        content: 'To create and maintain an account on the Service, you represent and warrant that:',
        list: [
          'You are at least 13 years of age',
          'You will provide true, accurate, and complete information during registration',
          'You will maintain the security and confidentiality of your password',
          'You are responsible for all activity that occurs under your account',
          'You will notify Circle Picks immediately of any unauthorized use or security breach of your account',
        ],
      },
      {
        title: 'User Content',
        content:
          'You retain all intellectual property rights to the content you create and share on Circle Picks, including experiences, photos, descriptions, and comments. By posting content, you grant Circle Picks a worldwide, non-exclusive, royalty-free, transferable license to use, display, reproduce, and distribute that content solely for the purpose of operating the Service. This license terminates when you delete the content or your account.',
      },
      {
        title: 'Visibility Controls',
        content:
          'Circle Picks provides visibility controls for your experiences. You may set your posts as public (visible to all users) or restricted to friends (visible only to mutual followers). You are responsible for managing your visibility settings. Circle Picks is not responsible for content shared by third parties who have legitimate access to your posts.',
      },
      {
        title: 'Prohibited Conduct',
        content: 'When using the Service, you agree NOT to:',
        list: [
          'Post false, misleading, defamatory, or offensive content about places or people',
          'Violate intellectual property rights, trademarks, or copyrights of third parties',
          'Use the Service for any illegal or unauthorized purpose',
          'Send spam, unsolicited messages, or advertising',
          'Scrape, crawl, or perform automated data collection from the platform',
          'Harass, intimidate, or threaten other users',
          'Attempt to access other users\' accounts or Circle Picks internal systems',
          'Introduce viruses, malware, or malicious code into the Service',
        ],
      },
      {
        title: 'Intellectual Property',
        content:
          'The Circle Picks brand, including logos, visual design, interface, and platform technology, is the exclusive property of Circle Picks. Nothing in these Terms grants you any rights to our intellectual property. You may not copy, modify, distribute, or use our brand or visual elements without prior written authorization.',
      },
      {
        title: 'Limitation of Liability',
        content:
          'The Service is provided "as is" and "as available", without warranties of any kind, whether express or implied. Circle Picks does not guarantee that the Service will be uninterrupted, secure, or error-free. We are not responsible for decisions made based on recommendations from other users. Recommendations reflect the personal opinions of users and do not represent endorsement by Circle Picks. To the fullest extent permitted by law, Circle Picks shall not be liable for any indirect, incidental, special, or consequential damages.',
      },
      {
        title: 'Service Modifications',
        content:
          'We reserve the right to modify, suspend, or discontinue the Service, in whole or in part, at any time, with or without notice. We will not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.',
      },
      {
        title: 'Termination',
        content:
          'Circle Picks may suspend or terminate your account at any time, with or without notice, if you violate these Terms or for any other reason at our discretion. You may terminate your account at any time by contacting us at hello@circlepicks.app. Upon termination, your right to use the Service will cease immediately.',
      },
      {
        title: 'Governing Law',
        content:
          'These Terms are governed by and construed in accordance with the laws of the Federative Republic of Brazil. Any dispute shall be submitted to the courts of São Paulo/SP, Brazil, waiving any other jurisdiction, however privileged. This Service complies with the General Data Protection Law (LGPD — Law No. 13,709/2018).',
      },
      {
        title: 'Changes to Terms',
        content:
          'We may update these Terms of Use from time to time. When we make significant changes, we will notify you through the Service or by email. The updated version will be posted on this page with a new effective date. Continued use of the Service after changes are posted constitutes acceptance of the new terms.',
      },
    ],
    contact: {
      title: 'Contact',
      content:
        'If you have questions about this Privacy Policy, Terms of Use, or how we handle your personal data, contact us at: hello@circlepicks.app',
    },
  },
};

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  const t = content[locale as keyof typeof content] || content['pt-BR'];
  const tLanding = await getTranslations('landing');

  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar locale={locale} />

      {/* Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-medium-grey hover:text-dark-grey transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t.backToHome}
        </Link>

        <h1 className="text-3xl font-bold text-dark-grey mb-2">{t.title}</h1>
        <p className="text-medium-grey mb-10">{t.lastUpdated}</p>

        {/* Privacy Policy Section */}
        <h2 className="text-2xl font-bold text-dark-grey mb-6 pb-2 border-b border-divider">
          {t.privacyTitle}
        </h2>
        <div className="space-y-8 mb-12">
          {t.privacySections.map((section, index) => (
            <section key={index}>
              {section.title && (
                <h3 className="text-xl font-semibold text-dark-grey mb-3">
                  {section.title}
                </h3>
              )}
              <p className="text-medium-grey leading-relaxed mb-3">
                {section.content}
              </p>
              {section.list && (
                <ul className="list-disc list-inside text-medium-grey space-y-2 ml-2">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Terms of Use Section */}
        <h2 className="text-2xl font-bold text-dark-grey mb-6 pb-2 border-b border-divider">
          {t.termsTitle}
        </h2>
        <div className="space-y-8 mb-12">
          {t.termsSections.map((section, index) => (
            <section key={index}>
              <h3 className="text-xl font-semibold text-dark-grey mb-3">
                {section.title}
              </h3>
              <p className="text-medium-grey leading-relaxed mb-3">
                {section.content}
              </p>
              {section.list && (
                <ul className="list-disc list-inside text-medium-grey space-y-2 ml-2">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Contact Section */}
        <div className="pt-6 border-t border-divider">
          <h3 className="text-xl font-semibold text-dark-grey mb-3">
            {t.contact.title}
          </h3>
          <p className="text-medium-grey leading-relaxed">
            {t.contact.content}
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-divider">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/circle-picks.svg"
                alt="Circle Picks logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-bold text-primary">Circle Picks</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-medium-grey">
              <Link href={routes.legal.terms(locale)} className="hover:text-dark-grey transition-colors">
                {tLanding('footer.terms')}
              </Link>
              <Link href={routes.legal.privacy(locale)} className="hover:text-dark-grey transition-colors">
                {tLanding('footer.privacy')}
              </Link>
              <Link href="mailto:contact@circlepicks.app" className="hover:text-dark-grey transition-colors">
                {tLanding('footer.contact')}
              </Link>
            </div>
            <p className="text-sm text-medium-grey">
              © 2026 Circle Picks. {tLanding('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
