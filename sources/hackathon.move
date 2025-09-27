module hackathon::nft_transfer {

    // Erreurs
    const ENOT_NFT_OWNER: u64 = 0;
    const EINSUFFICIENT_FUNDS: u64 = 1;
    const EALREADY_USED: u64 = 2;
    const ENOT_USED: u64 = 3;

    // NFT qui donne le droit de transférer 0.1 SUI
    public struct TransferRight has key, store {
        id: sui::object::UID,
        used: bool,
        owner: address
    }

    // Événement pour tracker les utilisations
    public struct TransferUsed has copy, drop {
        nft_id: sui::object::ID,
        user: address,
        recipient: address,
        timestamp: u64
    }

    // Fonction pour créer un nouveau NFT de droit de transfert
    public fun mint_transfer_right(owner: address, ctx: &mut sui::tx_context::TxContext): TransferRight {
        TransferRight {
            id: sui::object::new(ctx),
            used: false,
            owner: owner
        }
    }

    // Fonction principale qui utilise le NFT pour transférer 0.1 SUI
    public fun use_transfer_right(
        nft: &mut TransferRight,
        sui_coin: &mut sui::coin::Coin<sui::sui::SUI>,
        recipient: address,
        ctx: &mut sui::tx_context::TxContext
    ) {
        // Vérifie que l'appelant est le propriétaire du NFT
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);

        // Vérifie que le NFT n'a pas déjà été utilisé
        assert!(!nft.used, EALREADY_USED);
        
        // Montant fixe de 0.1 SUI
        let amount: u64 = 100000000;
        assert!(sui::coin::value(sui_coin) >= amount, EINSUFFICIENT_FUNDS);
        
        // Marque le NFT comme utilisé
        nft.used = true;
        
        // Divise et transfère les fonds
        let coin_to_transfer = sui::coin::split(sui_coin, amount, ctx);
        sui::transfer::public_transfer(coin_to_transfer, recipient);

        // Émet un événement
        sui::event::emit(TransferUsed {
            nft_id: sui::object::uid_to_inner(&nft.id),
            user: sender,
            recipient: recipient,
            timestamp: sui::tx_context::epoch_timestamp_ms(ctx)
        });
    }

    // Fonction pour brûler le NFT après utilisation (optionnel)
    public fun burn_used_nft(
        nft: TransferRight,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        assert!(nft.used, ENOT_USED); // ENOT_USED (ne peut brûler que les NFT utilisés)

        // Le NFT est automatiquement brûlé quand il sort du scope
        let TransferRight { id, used: _, owner: _ } = nft;
        sui::object::delete(id);
    }

    // Fonction pour vérifier si un NFT peut encore être utilisé
    public fun can_use(nft: &TransferRight): bool {
        !nft.used
    }

    // Fonction pour transférer la propriété du NFT
    public fun transfer_nft(
        nft: &mut TransferRight,
        new_owner: address,
        ctx: &mut sui::tx_context::TxContext
    ) {
        let sender = sui::tx_context::sender(ctx);
        assert!(nft.owner == sender, ENOT_NFT_OWNER);
        nft.owner = new_owner;
    }
}
