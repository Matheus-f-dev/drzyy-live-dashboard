import type { Guest } from '../types'

const FIRST_NAMES = ['Lucas', 'Ana', 'Pedro', 'Julia', 'Mateus', 'Carla', 'Bruno', 'Fernanda',
  'Diego', 'Larissa', 'Rafael', 'Beatriz', 'Thiago', 'Camila', 'Gabriel', 'Aline']

const LAST_NAMES = ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira',
  'Almeida', 'Costa', 'Carvalho', 'Lima', 'Gomes', 'Martins']

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

let seq = 1

export function generateGuest(): Guest {
  const now = new Date()
  return {
    id: `#${String(seq++).padStart(4, '0')}`,
    name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    age: Math.floor(Math.random() * 33) + 18,
    isVip: Math.random() < 0.25,
    enteredAt: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  }
}
