import { loadSario } from './sario'
import { Entity } from '../entity'
import { Dict } from '../../types'

export type EntityFactory = () => Entity

export type EntityFactoryDict = Dict<EntityFactory>

export async function loadEntities(): Promise<EntityFactoryDict> {
  const factories: EntityFactoryDict = {}

  const addAs = (name: string) => (factory: EntityFactory) => {
    factories[name] = factory
  }

  await Promise.all([loadSario().then(addAs('sario'))])

  return factories
}
