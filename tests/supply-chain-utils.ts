import { newMockEvent } from "matchstick-as"
import { ethereum, Address } from "@graphprotocol/graph-ts"
import {
  AdminAdded,
  Log,
  PackageSnapshotAdded
} from "../generated/SupplyChain/SupplyChain"

export function createAdminAddedEvent(param0: Address): AdminAdded {
  let adminAddedEvent = changetype<AdminAdded>(newMockEvent())

  adminAddedEvent.parameters = new Array()

  adminAddedEvent.parameters.push(
    new ethereum.EventParam("param0", ethereum.Value.fromAddress(param0))
  )

  return adminAddedEvent
}

export function createLogEvent(message: string): Log {
  let logEvent = changetype<Log>(newMockEvent())

  logEvent.parameters = new Array()

  logEvent.parameters.push(
    new ethereum.EventParam("message", ethereum.Value.fromString(message))
  )

  return logEvent
}

export function createPackageSnapshotAddedEvent(
  snapshot: ethereum.Tuple
): PackageSnapshotAdded {
  let packageSnapshotAddedEvent = changetype<PackageSnapshotAdded>(
    newMockEvent()
  )

  packageSnapshotAddedEvent.parameters = new Array()

  packageSnapshotAddedEvent.parameters.push(
    new ethereum.EventParam("snapshot", ethereum.Value.fromTuple(snapshot))
  )

  return packageSnapshotAddedEvent
}
