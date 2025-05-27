import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { DeleteEmployeeUseCase } from '@/use-cases/delete-employee'
import { PrismaEmployeesRepository } from '@/repositories/prisma/prisma-employees-repository'

export async function remove(request: FastifyRequest, reply: FastifyReply) {
  const paramsSchema = z.object({
    id: z.string().uuid(),
  })

  const { id } = paramsSchema.parse(request.params)

  const employeesRepository = new PrismaEmployeesRepository()
  const useCase = new DeleteEmployeeUseCase(employeesRepository)

  await useCase.execute({ id })

  return reply.status(204).send()
}
