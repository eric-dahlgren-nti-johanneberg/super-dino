import { loadDino } from './dino'
import { Entity } from '../entity'
import { Dict } from '../../types'
import { loadOnion } from './onion'
import { loadStorMinon } from './storminon'

export type EntityFactory = () => Entity

export type EntityFactoryDict = Dict<EntityFactory>

export async function loadEntities(): Promise<EntityFactoryDict> {
  const factories: EntityFactoryDict = {}

  const addAs = (name: string) => (factory: EntityFactory) => {
    factories[name] = factory
  }

  await Promise.all([
    loadDino().then(addAs('sario')),
    loadOnion().then(addAs('onion')),
    loadStorMinon().then(addAs('storminon')),
  ])

  return factories
}
