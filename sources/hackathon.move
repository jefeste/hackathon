module hackathon::transfer_nft {
    const ENOT_NFT_OWNER: u64 = 0;
    const EINSUFFICIENT_FUNDS: u64 = 1;
    const EALREADY_USED: u64 = 2;

    public struct TransferRight has key, store {
        id: sui::object::UID,
        used: bool,
        owner: address,
    }

    public struct TransferExecuted has copy, drop {
        nft_id: sui::object::ID,
        recipient: address,
        amount: u64,
        timestamp_ms: u64,
    }

    public fun mint_transfer_right(recipient: address, ctx: &mut sui::tx_context::TxContext) {
        let nft = TransferRight {
            id: sui::object::new(ctx),
            used: false,
            owner: recipient,
        };
        sui::transfer::public_transfer(nft, recipient);
    }

    public fun fund_treasury(
        treasury: &mut sui::coin::Coin<sui::sui::SUI>,
        deposit: sui::coin::Coin<sui::sui::SUI>,
    ) {
        sui::coin::join(treasury, deposit);
    }

    public fun execute_transfer(
        nft: &mut TransferRight,
        treasury: &mut sui::coin::Coin<sui::sui::SUI>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        assert!(!nft.used, EALREADY_USED);

        let amount: u64 = 100_000_000; // 0.1 SUI en Mist
        assert!(sui::coin::value(treasury) >= amount, EINSUFFICIENT_FUNDS);

        nft.used = true;

        let payment = sui::coin::split(treasury, amount, ctx);
        sui::transfer::public_transfer(payment, sender);

        let nft_id = sui::object::uid_to_inner(&nft.id);
        let timestamp_ms = sui::tx_context::epoch_timestamp_ms(ctx);
        sui::event::emit(TransferExecuted {
            nft_id,
            recipient: sender,
            amount,
            timestamp_ms,
        });
    }

    public fun execute_and_burn_transfer(
        nft: TransferRight,
        treasury: &mut sui::coin::Coin<sui::sui::SUI>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        assert!(!nft.used, EALREADY_USED);

        let amount: u64 = 100_000_000;
        assert!(sui::coin::value(treasury) >= amount, EINSUFFICIENT_FUNDS);

        let payment = sui::coin::split(treasury, amount, ctx);
        sui::transfer::public_transfer(payment, sender);

        let TransferRight { id, used: _, owner: _ } = nft;
        let nft_id = sui::object::uid_to_inner(&id);
        sui::object::delete(id);

        let timestamp_ms = sui::tx_context::epoch_timestamp_ms(ctx);
        sui::event::emit(TransferExecuted {
            nft_id,
            recipient: sender,
            amount,
            timestamp_ms,
        });
    }

    public fun can_execute(nft: &TransferRight): bool {
        !nft.used
    }

    public fun transfer_nft_ownership(
        nft: &mut TransferRight,
        new_owner: address,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        nft.owner = new_owner;
    }
}

