/**
 * Seed script using JavaScript (no TypeScript compilation needed)
 * Run with: node prisma/seed.js
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@benurse.com' },
    update: {},
    create: {
      email: 'admin@benurse.com',
      password: adminPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })
  console.log('✅ Created admin user:', admin.email)

  // Create nurse user
  const nursePassword = await bcrypt.hash('nurse123', 10)
  const nurse = await prisma.user.upsert({
    where: { email: 'nurse@benurse.com' },
    update: {},
    create: {
      email: 'nurse@benurse.com',
      password: nursePassword,
      name: 'Enfermera',
      role: 'NURSE',
    },
  })
  console.log('✅ Created nurse user:', nurse.email)

  // Create categories
  const categoria1 = await prisma.category.upsert({
    where: { slug: 'informacion' },
    update: {},
    create: {
      name: 'Información',
      slug: 'informacion',
      description: 'Contenido educativo e informativo',
    },
  })

  const categoria2 = await prisma.category.upsert({
    where: { slug: 'prevencion' },
    update: {},
    create: {
      name: 'Prevención',
      slug: 'prevencion',
      description: 'Recursos de prevención y cuidado',
    },
  })

  console.log('✅ Created categories')

  // Create carousel slides with images from /public
  // Slide 1: Chat anónimo
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-1' },
    update: {
      title: '¿Tienes una duda y no sabes a quién preguntar?',
      subtitle: null,
      imageUrl: '/slide1.jpg',
      ctaText: 'Habla ahora (Chat anónimo)',
      ctaLink: '/chat',
      order: 0,
      isActive: true,
    },
    create: {
      id: 'slide-1',
      title: '¿Tienes una duda y no sabes a quién preguntar?',
      subtitle: null,
      imageUrl: '/slide1.jpg',
      ctaText: 'Habla ahora (Chat anónimo)',
      ctaLink: '/chat',
      order: 0,
      isActive: true,
    },
  })

  // Slide 2: Realidades
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-2' },
    update: {
      title: 'El sexo real no funciona como en los vídeos',
      subtitle: null,
      imageUrl: '/slide2.jpg',
      ctaText: 'Descúbrelo aquí',
      ctaLink: '/realities',
      order: 1,
      isActive: true,
    },
    create: {
      id: 'slide-2',
      title: 'El sexo real no funciona como en los vídeos',
      subtitle: null,
      imageUrl: '/slide2.jpg',
      ctaText: 'Descúbrelo aquí',
      ctaLink: '/realities',
      order: 1,
      isActive: true,
    },
  })

  // Slide 3: Cuídate
  await prisma.carouselSlide.upsert({
    where: { id: 'slide-3' },
    update: {
      title: 'Tu salud sexual también es cosa tuya',
      subtitle: null,
      imageUrl: '/slide3.jpg',
      ctaText: 'Cuídate',
      ctaLink: '/take-care',
      order: 2,
      isActive: true,
    },
    create: {
      id: 'slide-3',
      title: 'Tu salud sexual también es cosa tuya',
      subtitle: null,
      imageUrl: '/slide3.jpg',
      ctaText: 'Cuídate',
      ctaLink: '/take-care',
      order: 2,
      isActive: true,
    },
  })

  console.log('✅ Created carousel slides')

  // Create sample quick access cards
  await prisma.quickAccessCard.upsert({
    where: { id: 'card-1' },
    update: {},
    create: {
      id: 'card-1',
      title: 'Infórmate',
      description: 'Aprende sobre salud sexual',
      icon: 'book',
      link: '/learn',
      order: 0,
      isActive: true,
    },
  })

  await prisma.quickAccessCard.upsert({
    where: { id: 'card-2' },
    update: {},
    create: {
      id: 'card-2',
      title: 'Cuídate',
      description: 'Recursos de prevención',
      icon: 'heart',
      link: '/take-care',
      order: 1,
      isActive: true,
    },
  })

  await prisma.quickAccessCard.upsert({
    where: { id: 'card-3' },
    update: {},
    create: {
      id: 'card-3',
      title: 'Habla con BE NURSE',
      description: 'Chatea de forma anónima',
      icon: 'message',
      link: '/chat',
      order: 2,
      isActive: true,
    },
  })

  console.log('✅ Created quick access cards')

  // Create sample \"Sobre nosotros\" page
  await prisma.page.upsert({
    where: { slug: 'about' },
    update: {},
    create: {
      slug: 'about',
      title: 'Sobre nosotros',
      content: '<p>BE NURSE es una plataforma educativa sobre salud sexual.</p>',
      isPublished: true,
      sections: {
        create: [
          {
            title: 'Nuestra misión',
            content: '<p>Proporcionar información confiable y apoyo profesional.</p>',
            order: 0,
          },
        ],
      },
    },
  })

  // Create \"Infórmate\" page with structured sections
  const learnPage = await prisma.page.upsert({
    where: { slug: 'learn' },
    update: {},
    create: {
      slug: 'learn',
      title: 'Infórmate',
      content: '<p>Información sobre ITS, transmisión y autocuidado.</p>',
      isPublished: true,
    },
  })

  // Reset existing sections for Infórmate
  await prisma.section.deleteMany({
    where: { pageId: learnPage.id },
  })

  await prisma.section.createMany({
    data: [
      {
        pageId: learnPage.id,
        title: '¿Qué son las ITS?',
        order: 0,
        content: `
<p>Las ITS son las Infecciones de Transmisión Sexual. Se transmiten principalmente a través de las relaciones sexuales, con o sin penetración, sexo oral y también por contacto directo de piel con piel en algunas prácticas.</p>
<p>A veces se habla de enfermedades, pero no es exactamente lo mismo.</p>
<h3>Infección no es lo mismo que enfermedad</h3>
<ul>
  <li><strong>Una infección</strong> significa que el microorganismo está en el cuerpo.</li>
  <li><strong>Una enfermedad</strong> aparece cuando esa infección provoca síntomas o problemas de salud.</li>
</ul>
<p><strong>👉 Puedes tener una ITS sin sentir nada y no saberlo.</strong><br />Por eso es tan importante la información y la detección.</p>
<h3>¿Por qué son más frecuentes en jóvenes?</h3>
<p>Las ITS son más frecuentes en población joven por varios motivos:</p>
<ul>
  <li>Inicio de relaciones sexuales a edades tempranas.</li>
  <li>Uso irregular del preservativo.</li>
  <li>Falta de información clara y realista.</li>
  <li>Influencia de mitos, presión de grupo y contenidos digitales.</li>
  <li>Dificultad para hablar de dudas sin vergüenza.</li>
</ul>
<h3>Detectar una ITS a tiempo</h3>
<p>Detectar una ITS a tiempo:</p>
<ul>
  <li>Evita complicaciones de salud.</li>
  <li>Facilita el tratamiento.</li>
  <li>Reduce el riesgo de transmisión a otras personas.</li>
  <li>Te permite cuidarte mejor.</li>
</ul>
<p>Muchas ITS se pueden prevenir, y muchas se pueden tratar o controlar si se detectan a tiempo.</p>
<p><strong>👉 Informarte es el primer paso para cuidarte.</strong></p>
        `.trim(),
      },
      {
        pageId: learnPage.id,
        title: '¿Cómo se transmiten las ITS?',
        order: 1,
        content: `
<p>Las ITS se transmiten principalmente durante las relaciones sexuales. No siempre hace falta penetración para que exista riesgo.</p>
<h3>Relaciones sexuales con y sin penetración</h3>
<p>Las ITS pueden transmitirse:</p>
<ul>
  <li>En relaciones vaginales, anales u orales.</li>
  <li>Aunque no haya eyaculación.</li>
  <li>Incluso aunque sea una relación puntual.</li>
</ul>
<p><strong>👉 El riesgo depende del tipo de práctica y de si se usan o no métodos de protección.</strong></p>
<h3>Contacto piel con piel</h3>
<p>Algunas ITS se transmiten por contacto directo de la piel o las mucosas, sin necesidad de penetración.</p>
<p>Esto ocurre, por ejemplo, cuando hay:</p>
<ul>
  <li>Contacto genital directo.</li>
  <li>Rozamientos íntimos.</li>
  <li>Lesiones o pequeñas heridas en la piel.</li>
</ul>
<p>Por eso, aunque no haya penetración, puede existir riesgo.</p>
<h3>Transmisión oral y anal</h3>
<p>El sexo oral también puede transmitir ITS, tanto a quien lo recibe como a quien lo practica.</p>
<p>El sexo anal tiene un mayor riesgo si no se usan métodos de protección, debido a la fragilidad de la mucosa anal.</p>
<p><strong>👉 Usar preservativo o barreras de látex reduce mucho el riesgo.</strong></p>
<h3>Consumo de sustancias y aumento del riesgo</h3>
<p>El consumo de alcohol u otras sustancias puede:</p>
<ul>
  <li>Disminuir la percepción del riesgo.</li>
  <li>Dificultar la toma de decisiones.</li>
  <li>Aumentar la probabilidad de no usar protección.</li>
  <li>Favorecer prácticas de mayor riesgo.</li>
</ul>
<p>No es solo la sustancia, sino cómo influye en tus decisiones.</p>
<h3>¿Qué NO transmite ITS? (mitos comunes)</h3>
<p>Las ITS <strong>NO</strong> se transmiten por:</p>
<ul>
  <li>Abrazos o besos cotidianos.</li>
  <li>Compartir vasos, cubiertos o comida.</li>
  <li>Usar el mismo baño, ducha o piscina.</li>
  <li>Dar la mano.</li>
  <li>Convivir o estar cerca de alguien con una ITS.</li>
</ul>
<p><strong>👉 Tener una ITS no define a una persona ni la convierte en un riesgo en la vida diaria.</strong></p>
<h3>Un mensaje importante</h3>
<p>El riesgo no depende de “con quién”, sino de qué prácticas se realizan y cómo se protegen.</p>
<p>Informarte, protegerte y hacerte pruebas cuando toca es parte del autocuidado.</p>
        `.trim(),
      },
      {
        pageId: learnPage.id,
        title: 'ITS más comunes',
        order: 2,
        type: 'CARD_GRID',
        content: '',
        metadata: {
          items: [
            {
              key: 'vih',
              name: 'VIH',
              imageUrl: '/its/vih.jpg',
              whatIs: 'Es un virus que afecta al sistema inmunitario. Con tratamiento, muchas personas viven una vida larga y saludable.',
              symptoms: 'A veces no hay síntomas al inicio. En la fase aguda puede parecer una gripe (fiebre, malestar, ganglios).',
              transmission: 'Principalmente por sexo sin protección y por sangre.',
              consequences: 'Sin tratamiento, puede debilitar las defensas y aumentar el riesgo de infecciones.',
              treatment: 'Tratamiento antirretroviral. Seguimiento sanitario regular.',
              prevention: 'Preservativo, PrEP (en algunos casos), pruebas. U=U: indetectable = intransmisible con tratamiento eficaz.',
            },
            {
              key: 'vph',
              name: 'VPH (Virus del Papiloma Humano)',
              imageUrl: '/its/vph.jpg',
              whatIs: 'Grupo de virus muy comunes. Algunos tipos causan verrugas y otros pueden causar lesiones.',
              symptoms: 'Muchas veces no da síntomas. A veces verrugas genitales.',
              transmission: 'Contacto piel con piel/genital y sexo vaginal/anal/oral.',
              consequences: 'Algunos tipos se asocian a lesiones que requieren seguimiento.',
              treatment: 'Seguimiento según caso (controles). Tratamiento de verrugas/lesiones cuando procede.',
              prevention: 'Vacunación y uso de preservativo (reduce el riesgo, no lo elimina al 100%).',
            },
            {
              key: 'clamidia',
              name: 'Clamidia',
              imageUrl: '/its/clamidia.jpg',
              whatIs: 'ITS bacteriana frecuente, a menudo silenciosa.',
              symptoms: 'A menudo ninguno. Puede haber escozor al orinar, secreción, dolor pélvico o testicular.',
              transmission: 'Sexo vaginal/anal/oral sin protección (según prácticas).',
              consequences: 'Si no se trata, puede causar complicaciones y afectar a la fertilidad.',
              treatment: 'Antibióticos y control/seguimiento según indicación sanitaria.',
              prevention: 'Preservativo y pruebas si hay cambios de pareja o prácticas de riesgo.',
            },
            {
              key: 'gonorrea',
              name: 'Gonorrea',
              imageUrl: '/its/gonorrea.jpg',
              whatIs: 'ITS bacteriana. Puede afectar genitales, recto o garganta.',
              symptoms: 'Secreción, dolor al orinar, molestias anales o de garganta (a veces sin síntomas).',
              transmission: 'Sexo vaginal/anal/oral sin protección (según prácticas).',
              consequences: 'Puede provocar complicaciones si no se trata.',
              treatment: 'Antibióticos (es importante tratarla correctamente por resistencias).',
              prevention: 'Preservativo y pruebas periódicas si corresponde.',
            },
            {
              key: 'sifilis',
              name: 'Sífilis',
              imageUrl: '/its/sifilis.jpg',
              whatIs: 'ITS bacteriana que puede tener fases.',
              symptoms: 'Puede empezar con una lesión indolora; luego puede dar erupciones u otros síntomas.',
              transmission: 'Contacto con lesiones durante sexo vaginal/anal/oral.',
              consequences: 'Sin tratamiento puede causar problemas de salud importantes.',
              treatment: 'Antibióticos. Cuanto antes se trate, mejor.',
              prevention: 'Preservativo, pruebas y atención temprana ante síntomas o exposición.',
            },
            {
              key: 'herpes',
              name: 'Herpes genital',
              imageUrl: '/its/herpes.jpg',
              whatIs: 'Infección viral que puede producir brotes.',
              symptoms: 'Ampollas o úlceras dolorosas; a veces brotes leves o inexistentes.',
              transmission: 'Contacto piel con piel, incluso sin lesiones visibles (riesgo variable).',
              consequences: 'Brotes recurrentes en algunas personas.',
              treatment: 'Antivirales para reducir brotes y síntomas.',
              prevention: 'Barreras y evitar contacto sexual cuando hay brotes.',
            },
            {
              key: 'hepatitis-bc',
              name: 'Hepatitis B y C',
              imageUrl: '/its/hepatitis.jpg',
              whatIs: 'Virus que afectan al hígado. La B tiene vacuna.',
              symptoms: 'A veces no hay síntomas; puede haber cansancio, ictericia u otros (no siempre).',
              transmission: 'Sangre; la hepatitis B también puede transmitirse sexualmente.',
              consequences: 'Puede causar problemas hepáticos si no se detecta y trata.',
              treatment: 'Existen tratamientos. En hepatitis C, muchos casos se curan con medicación.',
              prevention: 'Vacuna (hepatitis B), preservativo, no compartir material de consumo.',
            },
          ],
        },
      },
      {
        pageId: learnPage.id,
        title: 'Detección y pruebas',
        order: 3,
        content: `
<p>Hacerse pruebas no es “exagerar”: es cuidarse. Muchas ITS pueden no dar síntomas y aun así transmitirse.</p>

<h3>¿Cuándo tiene sentido hacerse pruebas?</h3>
<ul>
  <li>Si has tenido sexo sin preservativo (vaginal, anal u oral) o si se rompió.</li>
  <li>Si has cambiado de pareja o tienes varias parejas.</li>
  <li>Si tienes síntomas (pero recuerda: puede no haber).</li>
  <li>Si tu pareja ha tenido un diagnóstico o duda.</li>
  <li>Si quieres quedarte tranquilo/a: también es válido.</li>
</ul>

<h3>¿Qué tipo de pruebas existen?</h3>
<ul>
  <li><strong>Análisis de sangre:</strong> por ejemplo para VIH, sífilis, hepatitis.</li>
  <li><strong>Muestras locales:</strong> orina, exudado vaginal/uretral, anal o de garganta (según prácticas) para clamidia/gonorrea, etc.</li>
  <li><strong>Revisiones:</strong> según edad y recomendaciones (por ejemplo, cribado de VPH/citología en algunos casos).</li>
</ul>

<h3>Ventana diagnóstica (muy importante)</h3>
<p>Algunas pruebas no detectan la infección inmediatamente. Existe un tiempo llamado <strong>ventana diagnóstica</strong>.</p>
<ul>
  <li>Si te haces la prueba “demasiado pronto”, puede salir negativa aunque haya infección.</li>
  <li>Si tienes dudas sobre el momento adecuado, pregunta: te orientamos sin juzgar.</li>
</ul>

<h3>¿Dónde hacerse pruebas?</h3>
<ul>
  <li>Centro de salud (médico/a de familia, enfermería).</li>
  <li>Centros de salud sexual / ITS (según tu ciudad).</li>
  <li>Servicios comunitarios o recursos específicos para jóvenes.</li>
</ul>

<h3>Si sale positiva…</h3>
<ul>
  <li>No estás solo/a: la mayoría de ITS tienen tratamiento o control.</li>
  <li>Seguir el tratamiento y avisar a parejas recientes es parte del cuidado (con apoyo profesional).</li>
  <li>Evita culpas: lo importante es actuar.</li>
</ul>

<p><strong>👉 Si no sabes por dónde empezar, puedes escribirnos en el chat anónimo y te orientamos.</strong></p>
        `.trim(),
      },
    ],
  })

  // FAQ section (accordion) using metadata
  await prisma.section.create({
    data: {
      pageId: learnPage.id,
      title: 'Preguntas frecuentes (FAQ)',
      order: 4,
      type: 'FAQ',
      content: '',
      metadata: {
        items: [
          {
            question: '¿Puedo tener una ITS sin síntomas?',
            answer:
              '<p>Sí. Muchas ITS pueden no dar síntomas durante un tiempo (o nunca) y aun así transmitirse. Por eso las pruebas y el uso de métodos de protección son importantes.</p>',
          },
          {
            question: '¿El preservativo protege al 100%?',
            answer:
              '<p>Reduce muchísimo el riesgo, pero no siempre lo elimina al 100%, especialmente en ITS que se transmiten por contacto piel con piel (como VPH o herpes) si hay zonas no cubiertas. Aun así, es una de las mejores herramientas de prevención.</p>',
          },
          {
            question: '¿El sexo oral tiene riesgo?',
            answer:
              '<p>Sí, puede haber riesgo de transmisión de algunas ITS. Usar preservativo o barreras de látex reduce el riesgo.</p>',
          },
          {
            question: '¿Me da vergüenza pedir una prueba… es normal?',
            answer:
              '<p>Es muy común sentir vergüenza, pero pedir una prueba es un acto de autocuidado. Los profesionales sanitarios están para ayudarte sin juzgar.</p>',
          },
          {
            question: 'Si una prueba sale positiva, ¿qué hago?',
            answer:
              '<p>Busca atención sanitaria para tratamiento o seguimiento. Muchas ITS tienen tratamiento o control. Y si necesitas orientación, puedes escribirnos en el chat anónimo.</p>',
          },
        ],
      },
    },
  })

  console.log('✅ Created content for \"Infórmate\" page')

  // Create \"Cuídate\" page with care prevention cards
  const takeCarePage = await prisma.page.upsert({
    where: { slug: 'take-care' },
    update: {},
    create: {
      slug: 'take-care',
      title: 'Cuídate',
      content: '<p>Información y recursos para cuidarte y prevenir.</p>',
      isPublished: true,
    },
  })

  // Reset existing sections for Cuídate
  await prisma.section.deleteMany({
    where: { pageId: takeCarePage.id },
  })

  // Create Cuídate cards section with all 6 care topics
  await prisma.section.create({
    data: {
      pageId: takeCarePage.id,
      title: 'Métodos de cuidado y prevención',
      order: 0,
      type: 'CARD_GRID',
      content: '',
      metadata: {
        items: [
          {
            key: 'metodos-prevencion',
            title: 'MÉTODOS DE PREVENCIÓN',
            briefDescription: 'Prevenir no va de tener miedo. Va de tener información y opciones para decidir cómo cuidarte.',
            imageUrl: '/cuídate/prevencion.jpg',
            fullContent: `
<p>Prevenir no va de tener miedo. Va de tener información y opciones para decidir cómo cuidarte.</p>

<p>No existe un único método perfecto para todo. Cada práctica tiene formas distintas de reducir el riesgo.</p>

<h4>¿Qué entendemos por prevención?</h4>
<p>La prevención en salud sexual incluye todas aquellas medidas que ayudan a:</p>
<ul>
  <li>Reducir el riesgo de contraer una ITS.</li>
  <li>Proteger tu salud y la de la otra persona.</li>
  <li>Tomar decisiones más seguras y conscientes.</li>
</ul>

<p><strong>Prevenir no significa dejar de disfrutar, significa disfrutar con cuidado.</strong></p>

<h4>Métodos que ayudan a prevenir las ITS</h4>

<h5>🔹 Métodos de barrera</h5>
<p>Son los más conocidos y eficaces para reducir el riesgo de ITS.</p>
<p>Incluyen:</p>
<ul>
  <li>Preservativo externo.</li>
  <li>Preservativo interno.</li>
  <li>Barreras de látex para sexo oral.</li>
</ul>
<p><strong>👉 Reducen mucho el riesgo cuando se usan correctamente.</strong></p>

<h5>🔹 Vacunación</h5>
<p>Algunas infecciones se pueden prevenir con vacunas, como el virus del papiloma humano (VPH) o la hepatitis B.</p>
<p>La vacunación es una forma de protección a largo plazo. No sustituye al preservativo, pero lo complementa.</p>

<h5>🔹 Pruebas diagnósticas</h5>
<p>Hacerse pruebas forma parte de la prevención.</p>
<ul>
  <li>Muchas ITS no dan síntomas.</li>
  <li>Saber si tienes una infección te permite tratarla a tiempo.</li>
  <li>También protege a las personas con las que te relacionas.</li>
</ul>
<p><strong>👉 Hacerse pruebas es una decisión responsable.</strong></p>

<h5>🔹 Información y toma de decisiones</h5>
<p>Conocer los riesgos de cada práctica ayuda a decidir mejor.</p>
<ul>
  <li>No todas las prácticas tienen el mismo riesgo.</li>
  <li>El consumo de alcohol u otras sustancias puede influir en tus decisiones.</li>
  <li>Parar, pensar y hablarlo también es prevención.</li>
</ul>

<h4>Lo que NO es prevención</h4>
<ul>
  <li>Confiar solo en "conocer bien" a la otra persona.</li>
  <li>Pensar que "si no hay síntomas, no pasa nada".</li>
  <li>Creer que solo existe riesgo en relaciones con penetración.</li>
</ul>
<p><strong>👉 Los mitos no protegen. La información sí.</strong></p>

<h4>Un mensaje importante</h4>
<p>Prevenir no es una obligación impuesta desde fuera.<br>
Es una elección personal basada en el cuidado y el respeto.</p>
<p><strong>Cuidarte es informarte, decidir y protegerte.</strong></p>
            `.trim(),
          },
          {
            key: 'preservativo-externo-interno',
            title: 'PRESERVATIVO EXTERNO E INTERNO',
            briefDescription: 'El preservativo es uno de los métodos más eficaces para prevenir las ITS. Cuando se usa bien, reduce mucho el riesgo y protege a todas las personas implicadas.',
            imageUrl: '/cuídate/preservativo.jpg',
            fullContent: `
<p>El preservativo es uno de los métodos más eficaces para prevenir las ITS.<br>
Cuando se usa bien, reduce mucho el riesgo y protege a todas las personas implicadas.</p>

<p>Existen dos tipos principales: preservativo externo y preservativo interno.<br>
Ambos funcionan. La elección depende de la situación y de la persona.</p>

<h4>Preservativo externo</h4>
<p>Es el más conocido.</p>
<ul>
  <li>Se coloca sobre el pene.</li>
  <li>Protege frente a la mayoría de las ITS.</li>
  <li>También previene embarazos no deseados.</li>
  <li>Es fácil de conseguir y usar.</li>
</ul>
<p><strong>👉 Funciona mejor cuando:</strong></p>
<ul>
  <li>Se usa desde el inicio de la relación sexual.</li>
  <li>Se coloca correctamente.</li>
  <li>Se utiliza uno nuevo en cada relación.</li>
</ul>

<h4>Preservativo interno</h4>
<p>Es menos conocido, pero igual de válido.</p>
<ul>
  <li>Se coloca dentro de la vagina o el ano.</li>
  <li>Da más control a quien lo usa.</li>
  <li>Puede colocarse antes de la relación sexual.</li>
  <li>También protege frente a ITS y embarazos.</li>
</ul>
<p><strong>👉 Es una buena opción si:</strong></p>
<ul>
  <li>No puedes usar preservativo externo.</li>
  <li>Quieres tener más autonomía sobre la protección.</li>
  <li>Buscas una alternativa igual de segura.</li>
</ul>

<h4>Errores comunes que reducen la protección</h4>
<p>Algunos fallos son más habituales de lo que parece:</p>
<ul>
  <li>Colocarlo tarde.</li>
  <li>No dejar espacio en la punta.</li>
  <li>Usar dos a la vez.</li>
  <li>Reutilizarlo.</li>
  <li>Usarlo después de haber consumido alcohol u otras sustancias sin prestar atención.</li>
</ul>
<p><strong>👉 Estos errores no significan irresponsabilidad, solo falta de información.</strong></p>

<h4>¿Y el placer?</h4>
<p>El preservativo no elimina el placer.</p>
<ul>
  <li>Existen distintos tamaños, materiales y texturas.</li>
  <li>Usar lubricante puede mejorar la experiencia.</li>
  <li>Sentirte seguro/a también influye en cómo disfrutas.</li>
</ul>
<p><strong>👉 Cuidarte también forma parte del disfrute.</strong></p>

<h4>Un mensaje importante</h4>
<p>Usar preservativo no es desconfianza.<br>
Es respeto, cuidado y responsabilidad compartida.</p>
<p><strong>Protegerte es una decisión que habla bien de ti.</strong></p>
            `.trim(),
          },
          {
            key: 'barreras-latex',
            title: 'BARRERAS DE LÁTEX',
            briefDescription: 'Las barreras de látex son un método de protección poco conocido, pero muy útil para reducir el riesgo de ITS, especialmente durante el sexo oral. Que no se hable mucho de ellas no significa que no sean importantes.',
            imageUrl: '/cuídate/barreras.jpg',
            fullContent: `
<p>Las barreras de látex son un método de protección poco conocido, pero muy útil para reducir el riesgo de ITS, especialmente durante el sexo oral.</p>

<p>Que no se hable mucho de ellas no significa que no sean importantes.</p>

<h4>¿Qué son las barreras de látex?</h4>
<p>Son láminas finas de látex que se colocan entre la boca y los genitales o el ano durante el sexo oral.</p>
<ul>
  <li>Actúan como una barrera física.</li>
  <li>Evitan el contacto directo con fluidos y mucosas.</li>
  <li>Reducen el riesgo de transmisión de ITS.</li>
</ul>
<p><strong>👉 Funcionan de forma similar al preservativo, pero adaptadas al sexo oral.</strong></p>

<h4>¿Cuándo se recomienda usarlas?</h4>
<p>Las barreras de látex son especialmente útiles en:</p>
<ul>
  <li>Sexo oral en vagina.</li>
  <li>Sexo oral en ano.</li>
  <li>Prácticas donde hay contacto directo boca-genital o boca-ano.</li>
</ul>
<p>Aunque muchas personas no lo sepan, el sexo oral también puede transmitir ITS.</p>

<h4>¿Por qué casi no se usan?</h4>
<p>Principalmente por:</p>
<ul>
  <li>Falta de información.</li>
  <li>Poca visibilidad en educación sexual.</li>
  <li>Creencia de que el sexo oral "no tiene riesgo".</li>
  <li>Vergüenza o desconocimiento sobre cómo usarlas.</li>
</ul>
<p><strong>👉 No usarlas no es un fallo personal. Es una falta de información general.</strong></p>

<h4>¿Cómo se usan?</h4>
<ul>
  <li>Se coloca la barrera cubriendo la zona genital o anal.</li>
  <li>Se mantiene durante toda la práctica.</li>
  <li>Se utiliza una barrera nueva en cada relación.</li>
  <li>Puede usarse lubricante para mayor comodidad.</li>
</ul>
<p><strong>👉 Son fáciles de usar cuando sabes que existen.</strong></p>

<h4>Alternativas</h4>
<p>Si no tienes una barrera de látex:</p>
<ul>
  <li>Un preservativo externo cortado puede cumplir la misma función.</li>
  <li>Es importante que sea nuevo y sin usar.</li>
</ul>

<h4>Un mensaje importante</h4>
<p>Protegerse en el sexo oral también es cuidarse.<br>
No hace que la experiencia sea menos válida ni menos íntima.</p>
<p><strong>La información te da más opciones para decidir cómo cuidarte.</strong></p>
            `.trim(),
          },
          {
            key: 'vacunacion',
            title: 'Vacunación',
            briefDescription: 'Vacunarse también es una forma de cuidarte. En salud sexual, la vacunación ayuda a prevenir infecciones antes de que aparezcan. No sustituye a otros métodos de prevención, pero los complementa.',
            imageUrl: '/cuídate/vacunacion.jpg',
            fullContent: `
<p>Vacunarse también es una forma de cuidarte.<br>
En salud sexual, la vacunación ayuda a prevenir infecciones antes de que aparezcan.</p>

<p>No sustituye a otros métodos de prevención, pero los complementa.</p>

<h4>¿Qué tiene que ver la vacunación con la salud sexual?</h4>
<p>Algunas infecciones de transmisión sexual se pueden prevenir con vacunas.<br>
Las más conocidas son:</p>
<ul>
  <li>Virus del Papiloma Humano (VPH)</li>
  <li>Hepatitis B</li>
</ul>
<p>Estas infecciones pueden tener consecuencias a largo plazo si no se previenen o controlan.</p>

<h4>Vacunarse no es solo "cosa de infancia"</h4>
<p>Muchas personas piensan que la vacunación solo es importante cuando somos pequeños/as.<br>
En realidad, la vacunación sigue siendo clave en la adolescencia y juventud.</p>
<ul>
  <li>Aunque ya hayas tenido relaciones sexuales, la vacuna sigue siendo útil.</li>
  <li>Protege frente a tipos de virus que quizás no has tenido.</li>
  <li>Ayuda a reducir riesgos futuros.</li>
</ul>
<p><strong>👉 Nunca es "demasiado tarde" para informarte.</strong></p>

<h4>¿La vacuna sustituye al preservativo?</h4>
<p>No.</p>
<ul>
  <li>La vacunación no protege frente a todas las ITS.</li>
  <li>El preservativo sigue siendo fundamental.</li>
</ul>
<p><strong>👉 La mejor prevención es combinar métodos: información, protección y vacunación.</strong></p>

<h4>Dudas frecuentes sobre la vacunación</h4>
<p>Es normal tener preguntas:</p>
<ul>
  <li>¿Es segura?</li>
  <li>¿Tiene efectos secundarios?</li>
  <li>¿Dónde puedo vacunarme?</li>
  <li>¿Está incluida en el sistema público?</li>
</ul>
<p><strong>👉 Resolver dudas también forma parte del autocuidado.</strong><br>
Hablar con profesionales de salud te ayuda a decidir con tranquilidad.</p>

<h4>Un mensaje importante</h4>
<p>Vacunarte es una decisión personal, informada y responsable.<br>
No tiene que ver con miedo, sino con pensar en tu salud presente y futura.</p>
<p><strong>Cuidarte hoy también es cuidar de tu futuro.</strong></p>
            `.trim(),
          },
          {
            key: 'pruebas-diagnosticas',
            title: 'PRUEBAS DIAGNÓSTICAS',
            briefDescription: 'Hacerse pruebas también es cuidarse. No es una señal de desconfianza ni de irresponsabilidad. Es una decisión consciente sobre tu salud.',
            imageUrl: '/cuídate/pruebas.jpg',
            fullContent: `
<p>Hacerse pruebas también es cuidarse.<br>
No es una señal de desconfianza ni de irresponsabilidad.<br>
Es una decisión consciente sobre tu salud.</p>

<p>Muchas ITS no dan síntomas, así que la única forma de saberlo es mediante una prueba.</p>

<h4>¿Cuándo es recomendable hacerse una prueba?</h4>
<p>Puede ser buena idea hacerte una prueba si:</p>
<ul>
  <li>Has tenido relaciones sexuales sin protección.</li>
  <li>Has cambiado de pareja o tienes varias parejas.</li>
  <li>Has tenido una relación ocasional.</li>
  <li>Has consumido alcohol u otras sustancias y no recuerdas bien la situación.</li>
  <li>Tienes síntomas o molestias.</li>
  <li>Simplemente quieres quedarte tranquilo/a.</li>
</ul>
<p><strong>👉 No hace falta esperar a "notar algo".</strong></p>

<h4>¿Qué tipo de pruebas existen?</h4>
<p>Las pruebas pueden variar según la ITS:</p>
<ul>
  <li>Análisis de sangre.</li>
  <li>Muestras de orina.</li>
  <li>Exudados (muestras locales).</li>
  <li>Pruebas rápidas en algunos casos.</li>
</ul>
<p>Un profesional sanitario te indicará cuál es la más adecuada según tu situación.</p>

<h4>Confidencialidad y privacidad</h4>
<p>Las pruebas se realizan de forma confidencial.</p>
<ul>
  <li>Tu información está protegida.</li>
  <li>Nadie tiene por qué saberlo si tú no quieres.</li>
  <li>Puedes preguntar todas tus dudas sin juicio.</li>
</ul>
<p><strong>👉 La confidencialidad es un derecho.</strong></p>

<h4>¿Y si el resultado es positivo?</h4>
<p>Un resultado positivo no define quién eres.</p>
<ul>
  <li>Muchas ITS tienen tratamiento.</li>
  <li>Otras se pueden controlar con seguimiento médico.</li>
  <li>Detectarlas a tiempo evita complicaciones.</li>
</ul>
<p><strong>👉 Saberlo te permite cuidarte mejor y cuidar a otras personas.</strong></p>

<h4>Un mensaje importante</h4>
<p>Hacerse pruebas no es exagerar ni preocuparse de más.<br>
Es una forma de responsabilizarte de tu bienestar.</p>
<p><strong>Cuidarte también es informarte y comprobar.</strong></p>
            `.trim(),
          },
          {
            key: 'consentimiento',
            title: 'CONSENTIMIENTO',
            briefDescription: 'El consentimiento es la base de cualquier relación sana. Sin consentimiento, no hay sexo ni relación saludable. No es algo complicado ni ambiguo. Es una cuestión de respeto y cuidado mutuo.',
            imageUrl: '/cuídate/consentimiento.jpg',
            fullContent: `
<p>El consentimiento es la base de cualquier relación sana.<br>
Sin consentimiento, no hay sexo ni relación saludable.</p>

<p>No es algo complicado ni ambiguo.<br>
Es una cuestión de respeto y cuidado mutuo.</p>

<h4>¿Qué es el consentimiento?</h4>
<p>El consentimiento es un sí claro, libre y consciente.</p>

<p>Significa que todas las personas implicadas:</p>
<ul>
  <li>Quieren participar.</li>
  <li>Entienden lo que está pasando.</li>
  <li>Se sienten cómodas con la situación.</li>
</ul>
<p><strong>👉 El silencio, la duda o la presión no son consentimiento.</strong></p>

<h4>El consentimiento debe ser…</h4>
<ul>
  <li><strong>Libre:</strong> sin presión, chantaje ni insistencia.</li>
  <li><strong>Claro:</strong> no vale "supongo", "bueno…" o "si no dices que no".</li>
  <li><strong>Continuo:</strong> se puede cambiar de opinión en cualquier momento.</li>
  <li><strong>Mutuo:</strong> todas las personas cuentan por igual.</li>
</ul>
<p><strong>👉 Decir "no" o cambiar de idea es siempre válido.</strong></p>

<h4>Consentimiento y consumo de sustancias</h4>
<p>El alcohol u otras sustancias pueden afectar:</p>
<ul>
  <li>A la capacidad de decidir.</li>
  <li>A la percepción de lo que se quiere o no.</li>
  <li>A la comunicación clara.</li>
</ul>
<p><strong>👉 Si alguien no puede decidir con claridad, no hay consentimiento.</strong></p>

<h4>Mitos frecuentes sobre el consentimiento</h4>
<ul>
  <li><strong>"Si ya habíamos empezado, no podía parar"</strong> ❌</li>
  <li><strong>"Si no dijo que no, es que sí"</strong> ❌</li>
  <li><strong>"Si es mi pareja, no hace falta preguntar"</strong> ❌</li>
</ul>
<p><strong>👉 El consentimiento no se da una vez para siempre.</strong></p>

<h4>Un mensaje importante</h4>
<p>El consentimiento no quita espontaneidad.<br>
Al contrario: genera confianza y seguridad.</p>

<p>Hablar, preguntar y escuchar también forma parte de disfrutar.</p>

<p><strong>Sin un sí claro, no es un sí.</strong></p>
            `.trim(),
          },
        ],
      },
    },
  })

  console.log('✅ Created content for \"Cuídate\" page')

  console.log('🎉 Seeding completed!')
  console.log('\n📝 Default credentials:')
  console.log('   Admin: admin@benurse.com / admin123')
  console.log('   Nurse: nurse@benurse.com / nurse123')
  console.log('\n⚠️  Remember to change these passwords in production!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

