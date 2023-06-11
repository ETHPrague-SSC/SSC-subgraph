import { log} from "@graphprotocol/graph-ts"
import {
    SupplyChain,
    AdminAdded,
    PackageSnapshotAdded, AdminRemoved
} from "../generated/SupplyChain/SupplyChain"
import {Admin, Branch, PackageSnapshot} from "../generated/schema"

function addObjToArray<T>(array: T[] | null, obj: T): T[] {
    if (array == null) {
        array = new Array<T>()
    }
    array.push(obj)
    return array
}

export function handleAdminAdded(event: AdminAdded): void {
    const sender = event.params.param0;
    let admin = Admin.load(sender);
    if (!admin) {
        admin = new Admin(sender);
    }
    admin.isAdmin = true;
    admin.save();
}

export function handleAdminRemoved(event: AdminRemoved): void {
    const sender = event.params.param0;
    const admin = Admin.load(sender);
    if (!admin) {
        log.error("Admin {} does not exist", [sender.toString()]);
        return;
    }
    admin.isAdmin = true;
    admin.save();
}

export function handlePackageSnapshotAdded(event: PackageSnapshotAdded): void {
    const snapshot = new PackageSnapshot(event.params.id.toString());
    snapshot.created = event.params.snapshot.created;
    snapshot.handler = event.params.snapshot.handler.addr;
    snapshot.description = event.params.snapshot.description;
    snapshot.name = event.params.snapshot.name;
    snapshot.status = event.params.snapshot.status;
    let branch: Branch | null = null;
    if (event.params.snapshot.parent.toU64() != 0) {
        snapshot.parent = event.params.snapshot.parent.toString();
        let tempSnapshot = PackageSnapshot.load(snapshot.parent!)!;
        while (tempSnapshot.parent != null) {
            tempSnapshot = PackageSnapshot.load(tempSnapshot.parent!)!;
        }
        branch = Branch.load(tempSnapshot.id);
    }

    if (branch) {
        branch.snapshots = addObjToArray(branch.snapshots, snapshot.id);
    } else {
        branch = new Branch(snapshot.id);
        branch.head = snapshot.id;
        branch.snapshots = [snapshot.id];
    }

    snapshot.save();
    branch.save()
}
