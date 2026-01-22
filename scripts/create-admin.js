/**
 * Script para crear un usuario administrador
 * Uso: node scripts/create-admin.js <email> <password>
 */

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const role = process.argv[4] || 'ADMIN'

  if (!email || !password) {
    console.error('Uso: node scripts/create-admin.js <email> <password> [role]')
    console.error('Roles disponibles: ADMIN, NURSE')
    process.exit(1)
  }

  if (!['ADMIN', 'NURSE'].includes(role)) {
    console.error('Rol inválido. Usa ADMIN o NURSE')
    process.exit(1)
  }

  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      console.error(`El usuario con email ${email} ya existe`)
      process.exit(1)
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name: email.split('@')[0],
      },
    })

    console.log(`✅ Usuario creado exitosamente:`)
    console.log(`   Email: ${user.email}`)
    console.log(`   Rol: ${user.role}`)
    console.log(`   ID: ${user.id}`)
  } catch (error) {
    console.error('Error creando usuario:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()

