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

