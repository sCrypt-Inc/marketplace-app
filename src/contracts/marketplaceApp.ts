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
    Utils,
    MethodCallOptions,
    ContractTransaction,
    bsv
} from 'scrypt-ts'

export type Item = {
    name: ByteString
    price: bigint
    sellerAddr: PubKeyHash
    isEmptySlot: boolean
}


export class MarketplaceApp extends SmartContract {

    static readonly ITEM_SLOTS = 10

    @prop(true)
    items: FixedArray<Item, typeof MarketplaceApp.ITEM_SLOTS>

    constructor() {
        super(...arguments)
        this.items = fill(
            {
                name: toByteString(''),
                price: 0n,
                sellerAddr: PubKeyHash(toByteString('0000000000000000000000000000000000000000')),
                isEmptySlot: true
            },
            MarketplaceApp.ITEM_SLOTS
        )
    }

    @method()
    public addItem(item: Item, itemIdx: bigint) {
        assert(this.items[Number(itemIdx)].isEmptySlot, 'item slot not empty')
        assert(!item.isEmptySlot, 'new item cannot have the "isEmptySlot" flag set to true')
        assert(item.price > 0n, 'item price must be at least one satoshi')

        this.items[Number(itemIdx)] = item

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        outputs += this.buildChangeOutput()
        assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
    }

    @method()
    public buyItem(itemIdx: bigint) {
        const item = this.items[Number(itemIdx)]

        this.items[Number(itemIdx)].isEmptySlot = true

        let outputs = this.buildStateOutput(this.ctx.utxo.value)
        outputs += Utils.buildPublicKeyHashOutput(item.sellerAddr, item.price)
        outputs += this.buildChangeOutput()
        assert(hash256(outputs) == this.ctx.hashOutputs, 'hashOutputs mismatch')
    }

    static buyTxBuilder(
        current: MarketplaceApp,
        options: MethodCallOptions<MarketplaceApp>,
        idx: bigint,
    ): Promise<ContractTransaction> {
        // Get item.
        const item = current.items[Number(idx)]

        // Create the next instance from the current.
        const nextInstance = current.next();

        // Set empty slot for next instance.
        nextInstance.items[Number(idx)].isEmptySlot = true

        const unsignedTx: bsv.Transaction = new bsv.Transaction()
            // Add contract input.
            .addInput(current.buildContractInput(options.fromUTXO))
            // Build next instance output.
            .addOutput(
                new bsv.Transaction.Output({
                    script: nextInstance.lockingScript,
                    satoshis: current.balance,
                })
            )
            // Add payment to seller output.
            //.to(bsv.Address.fromHex(item.sellerAddr), Number(item.price))
            .addOutput(
                new bsv.Transaction.Output({
                    script: bsv.Script.fromHex(
                        Utils.buildPublicKeyHashScript(item.sellerAddr).toString()
                    ),
                    satoshis: Number(item.price),
                })
            )

        // Build change output
        // TODO CHECK IF STILL ADDS CHANGE WITHOUT OPTION
        if (options.changeAddress) {
            unsignedTx.change(options.changeAddress)

        }

        return Promise.resolve({
            tx: unsignedTx,
            atInputIndex: 0,
            nexts: [
                {
                    instance: nextInstance,
                    atOutputIndex: 0,
                    balance: current.balance,
                },
            ],
        })
    }


}



