module hackathon::transfer_nft {
    const ENOT_NFT_OWNER: u64 = 0;
    const EINSUFFICIENT_FUNDS: u64 = 1;
    const EALREADY_USED: u64 = 2;
    const EINVALID_UPGRADE_CAP: u64 = 3;

    public struct PublisherWitness has drop {}

    public struct Treasury has key, store {
        id: sui::object::UID,
        balance: sui::balance::Balance<sui::sui::SUI>,
    }

    public struct TransferRight has key, store {
        id: sui::object::UID,
        used: bool,
        owner: address,
        preferred_kiosk: option::Option<sui::object::ID>,
    }

    public struct TransferExecuted has copy, drop {
        nft_id: sui::object::ID,
        recipient: address,
        amount: u64,
        timestamp_ms: u64,
    }

    public struct TreasuryCreated has copy, drop {
        treasury_id: sui::object::ID,
    }

    fun init(ctx: &mut sui::tx_context::TxContext) {
        let treasury = Treasury {
            id: sui::object::new(ctx),
            balance: sui::balance::zero(),
        };
        let treasury_id = sui::object::uid_to_inner(&treasury.id);
        sui::transfer::share_object(treasury);
        sui::event::emit(TreasuryCreated { treasury_id });
    }

    #[allow(lint(public_entry))]
    public entry fun claim_publisher(
        upgrade_cap: &sui::package::UpgradeCap,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        assert!(
            sui::package::upgrade_package(upgrade_cap)
                == sui::object::id_from_address(@hackathon),
            EINVALID_UPGRADE_CAP,
        );
        let publisher = sui::package::claim(PublisherWitness {}, ctx);
        sui::transfer::public_transfer(publisher, sui::tx_context::sender(ctx));
    }

    public fun mint_transfer_right(recipient: address, ctx: &mut sui::tx_context::TxContext) {
        let nft = TransferRight {
            id: sui::object::new(ctx),
            used: false,
            owner: recipient,
            preferred_kiosk: option::none(),
        };
        sui::transfer::public_transfer(nft, recipient);
    }

    public fun mint_transfer_right_for_kiosk(
        kiosk: &mut sui::kiosk::Kiosk,
        cap: &sui::kiosk::KioskOwnerCap,
        recipient: address,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let kiosk_id = sui::object::id(kiosk);
        let nft = TransferRight {
            id: sui::object::new(ctx),
            used: false,
            owner: recipient,
            preferred_kiosk: option::some(kiosk_id),
        };
        sui::kiosk::place(kiosk, cap, nft);
    }

    public fun fund_treasury(
        treasury: &mut Treasury,
        deposit: sui::coin::Coin<sui::sui::SUI>,
    ) {
        let deposit_balance = sui::coin::into_balance(deposit);
        sui::balance::join(&mut treasury.balance, deposit_balance);
    }

    public fun execute_transfer(
        nft: &mut TransferRight,
        treasury: &mut Treasury,
        ctx: &mut sui::tx_context::TxContext,
    ): sui::coin::Coin<sui::sui::SUI> {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        assert!(!nft.used, EALREADY_USED);

        let amount: u64 = 100_000_000; // 0.1 SUI en Mist
        assert!(sui::balance::value(&treasury.balance) >= amount, EINSUFFICIENT_FUNDS);

        nft.used = true;

        let payment_balance = sui::balance::split(&mut treasury.balance, amount);
        let payment = sui::coin::from_balance(payment_balance, ctx);

        let nft_id = sui::object::uid_to_inner(&nft.id);
        let timestamp_ms = sui::tx_context::epoch_timestamp_ms(ctx);
        sui::event::emit(TransferExecuted {
            nft_id,
            recipient: sender,
            amount,
            timestamp_ms,
        });

        payment
    }

    public fun execute_and_burn_transfer(
        nft: TransferRight,
        treasury: &mut Treasury,
        ctx: &mut sui::tx_context::TxContext,
    ): sui::coin::Coin<sui::sui::SUI> {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        assert!(!nft.used, EALREADY_USED);

        let amount: u64 = 100_000_000; // 0.1 SUI en Mist
        assert!(sui::balance::value(&treasury.balance) >= amount, EINSUFFICIENT_FUNDS);

        let payment_balance = sui::balance::split(&mut treasury.balance, amount);
        let payment = sui::coin::from_balance(payment_balance, ctx);

        let TransferRight {
            id,
            used: _,
            owner: _,
            preferred_kiosk: _,
        } = nft;
        let nft_id = sui::object::uid_to_inner(&id);
        sui::object::delete(id);

        let timestamp_ms = sui::tx_context::epoch_timestamp_ms(ctx);
        sui::event::emit(TransferExecuted {
            nft_id,
            recipient: sender,
            amount,
            timestamp_ms,
        });

        payment
    }

    public fun execute_transfer_to(
        nft: &mut TransferRight,
        treasury: &mut Treasury,
        recipient: address,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let payment = execute_transfer(nft, treasury, ctx);
        sui::transfer::public_transfer(payment, recipient);
    }

    public fun execute_and_burn_transfer_to(
        nft: TransferRight,
        treasury: &mut Treasury,
        recipient: address,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        let payment = execute_and_burn_transfer(nft, treasury, ctx);
        sui::transfer::public_transfer(payment, recipient);
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

