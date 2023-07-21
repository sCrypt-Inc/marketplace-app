import {
    method,
    prop,
    SmartContract,
    hash256,
    assert,
    ByteString,
    FixedArray,
    toByteString,
    fill,
    PubKeyHash,
    Utils
} from 'scrypt-ts'

export type Item = {
    name: ByteString
    price: bigint
    sellerAddr: PubKeyHash
    isEmptySlot: boolean
}

export class MarketplaceApp extends SmartContract {

    static readonly MAX_ITEMS = 100

    @prop(true)
    items: FixedArray<Item, typeof MarketplaceApp.MAX_ITEMS>

    constructor() {
        super(...arguments)

        const emptyItem: Item = {
            name: toByteString(''),
            price: 0n,
            sellerAddr: PubKeyHash(toByteString('0000000000000000000000000000000000000000')),
            isEmptySlot: true
        }
        this.items = fill(
            emptyItem,
            MarketplaceApp.MAX_ITEMS
        )
    }

    @method()
    public addItem(item: Item, itemIdx: bigint) {
        assert(this.items[Number(itemIdx)].isEmptySlot, 'item slot not empty')
        assert(!item.isEmptySlot, 'new item cannot have the "isEmptySlot" flag set to true')

        this.items[Number(itemIdx)] = item

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput()
        }
        assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
    }
    
    @method()
    public buyItem(itemIdx: bigint) {
        const item = this.items[Number(itemIdx)]

        const emptyItem: Item = {
            name: toByteString(''),
            price: 0n,
            sellerAddr: PubKeyHash(toByteString('0000000000000000000000000000000000000000')),
            isEmptySlot: true
        }
        this.items[Number(itemIdx)] = emptyItem
        
        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        outputs += Utils.buildPublicKeyHashOutput(item.sellerAddr, item.price)
        if (this.changeAmount > 0n) {
            outputs += this.buildChangeOutput()
        }
        assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
    }


}
