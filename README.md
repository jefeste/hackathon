Presentation V3 in English:

Slide – Presentation

Hi, I’m Jérémy Digard, and I worked on researching the idea and the move coding.

And I’m Robin Sanders. I worked on the website and the design.

⸻

Slide – Intro

SuInsure is a parametric insurance.
So what does this mean?: as soon as a measured indicator crosses a set threshold, compensation is triggered automatically. Meanwhile, DeFi puts the premiums to work (mutual fund).

Our objectives: fast compensation, trust by proof (not by promise), and easy secure access from anywhere in the world.


⸻

Slide – How it works (+ the demo)
ajouter une preuve qui vient de la blockchain 

The process happens through Slush, which offers great flexibility: either a simple connection with a zk-login account, or maximum security with a hot or cold wallet.

The insured customer selects a coverage, pays the premium, and it’s done — way faster than traditional insurance!

In addition, they will immediately receive proof of insurance: an on-chain NFT certificate that is traceable and tamper-proof.

Once the contract is set in place, an Oracle continuously checks public data. And if the threshold for the parameter is reached? The compensation goes straight to their wallet.

Meanwhile the pooled funds are being invested through DeFi. In the long run, we could operate through our own Sui validator node for optimal security.






# principales fonctions 

## modifier du package  en live
```
sui client call --package <package_id> --module transfer_nft --function claim_publisher --args <upgrade_cap_object_id>

```


## transferpolicy
```
sui client call --package 0x2 --module transfer_policy --function default --type-args 0xa38696917fd033a9fba4b7c0904e81e49bf1dbccab9f7a5e8b48e8141c15a3d1::transfer_nft::TransferRight --args <publisher_object_id>


```

## bruler le nft et se faire rembourser 

```
- Appelle simplement la fonction avec les deux IDs:
    - nft_id: l’ID de ton TransferRight (sera consommé/brûlé)
    - treasury_id: l’ID de l’objet Treasury (shared)
      
      
sui client call \
  --package <package_id> \
  --module transfer_nft \
  --function execute_and_burn_transfer \
  --args <transfer_right_id> <treasury_id> \
  --gas-budget 10000000
```

## alimenter la trésorerie 
```
--package  package \
  --module transfer_nft \
  --function fund_treasury \
  --args treasury_id \
         deposit_coin_id \
  --gas-budget 10000000
   
```


## créer le nft
```
sui client call \
  --package <package_id> \
  --module transfer_nft \
  --function mint_transfer_right \
  --args <ton_adresse> \
  --gas-budget 2000000
```


# créer le nft associé au kiosk 
```
sui client call --package <new_package_id> --module transfer_nft --function mint_transfer_right_for_kiosk --args <kiosk_object_id> <kiosk_owner_cap_id> <recipient_address>

```







# initialisation contract 
```
──────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Transaction Data                                                                                             │
├──────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Sender: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                                   │
│ Gas Owner: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                                │
│ Gas Budget: 25848800 MIST                                                                                    │
│ Gas Price: 1000 MIST                                                                                         │
│ Gas Payment:                                                                                                 │
│  ┌──                                                                                                         │
│  │ ID: 0x169fa038f40022143f16ac735e911111c250571465ea02ac4068a3587f283477                                    │
│  │ Version: 349180714                                                                                        │
│  │ Digest: BWDmihbyV78JWpUBkCyg8fYQFmjRycU4YtPP2K3gSAju                                                      │
│  └──                                                                                                         │
│                                                                                                              │
│ Transaction Kind: Programmable                                                                               │
│ ╭──────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ Input Objects                                                                                            │ │
│ ├──────────────────────────────────────────────────────────────────────────────────────────────────────────┤ │
│ │ 0   Pure Arg: Type: address, Value: "0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85" │ │
│ ╰──────────────────────────────────────────────────────────────────────────────────────────────────────────╯ │
│ ╭─────────────────────────────────────────────────────────────────────────╮                                  │
│ │ Commands                                                                │                                  │
│ ├─────────────────────────────────────────────────────────────────────────┤                                  │
│ │ 0  Publish:                                                             │                                  │
│ │  ┌                                                                      │                                  │
│ │  │ Dependencies:                                                        │                                  │
│ │  │   0x0000000000000000000000000000000000000000000000000000000000000001 │                                  │
│ │  │   0x0000000000000000000000000000000000000000000000000000000000000002 │                                  │
│ │  └                                                                      │                                  │
│ │                                                                         │                                  │
│ │ 1  TransferObjects:                                                     │                                  │
│ │  ┌                                                                      │                                  │
│ │  │ Arguments:                                                           │                                  │
│ │  │   Result 0                                                           │                                  │
│ │  │ Address: Input  0                                                    │                                  │
│ │  └                                                                      │                                  │
│ ╰─────────────────────────────────────────────────────────────────────────╯                                  │
│                                                                                                              │
│ Signatures:                                                                                                  │
│    ZsLleD+VebW5aIn+oVJkwby3kgBvp+I57orOhcl6ppExy0ngmcCHYXN8Jt2QuUoc3+uZpL4nd7v7BkGxJl8yBA==                  │
│                                                                                                              │
╰──────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Transaction Effects                                                                               │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Digest: 8kbKAFFRGgDCDL74G57T5Q1RoZN3r96kUoXDEZmnEJPT                                              │
│ Status: Success                                                                                   │
│ Executed Epoch: 871                                                                               │
│                                                                                                   │
│ Created Objects:                                                                                  │
│  ┌──                                                                                              │
│  │ ID: 0x13a222c355e6dd35e3257ab97c314ea5f5b3631e176d647da29a16c29d8e2246                         │
│  │ Owner: Shared( 349180715 )                                                                     │
│  │ Version: 349180715                                                                             │
│  │ Digest: Fzgg4G33HZNCo9tcLMEN4PdeQWyicAjE212iTtFx3i1E                                           │
│  └──                                                                                              │
│  ┌──                                                                                              │
│  │ ID: 0x1b9b3468bcbbc819807130a333c03fd19e2b7b062aa36ac90a8a2b255326bfab                         │
│  │ Owner: Immutable                                                                               │
│  │ Version: 1                                                                                     │
│  │ Digest: 6unPHy57oaqe5sU17tRm7zM6XNS8H845rF4YagqiZLyH                                           │
│  └──                                                                                              │
│  ┌──                                                                                              │
│  │ ID: 0xe6c53aaa27f1ca840810ace4cec5600910f6c64c61c24cd0e3ff6a4993be1767                         │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )  │
│  │ Version: 349180715                                                                             │
│  │ Digest: HQKs9AfmRnGKs6kDby2aLXbyKH1QnYhsjJb6bNtFoYtm                                           │
│  └──                                                                                              │
│ Mutated Objects:                                                                                  │
│  ┌──                                                                                              │
│  │ ID: 0x169fa038f40022143f16ac735e911111c250571465ea02ac4068a3587f283477                         │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )  │
│  │ Version: 349180715                                                                             │
│  │ Digest: GdUF8wwqM5Fh3sBJTLG8YjCHav8ZEyDNAacAqvmWMs4h                                           │
│  └──                                                                                              │
│ Gas Object:                                                                                       │
│  ┌──                                                                                              │
│  │ ID: 0x169fa038f40022143f16ac735e911111c250571465ea02ac4068a3587f283477                         │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )  │
│  │ Version: 349180715                                                                             │
│  │ Digest: GdUF8wwqM5Fh3sBJTLG8YjCHav8ZEyDNAacAqvmWMs4h                                           │
│  └──                                                                                              │
│ Gas Cost Summary:                                                                                 │
│    Storage Cost: 23848800 MIST                                                                    │
│    Computation Cost: 1000000 MIST                                                                 │
│    Storage Rebate: 978120 MIST                                                                    │
│    Non-refundable Storage Fee: 9880 MIST                                                          │
│                                                                                                   │
│ Transaction Dependencies:                                                                         │
│    2dkJtqsoQcyCZJvjZnskNVPQeynwVtwCcA9goAru6tTi                                                   │
│    6VDnL9zUz7zjeeFkTCfcY7MKvabiHUG3agxpaexp1tnk                                                   │
│    Dd9pn1zFcSJjinxQewFd2gQdR4XKsHxFioD5MYnwLZQz                                                   │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯
╭─────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Transaction Block Events                                                                                        │
├─────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──                                                                                                            │
│  │ EventID: 8kbKAFFRGgDCDL74G57T5Q1RoZN3r96kUoXDEZmnEJPT:0                                                      │
│  │ PackageID: 0x1b9b3468bcbbc819807130a333c03fd19e2b7b062aa36ac90a8a2b255326bfab                                │
│  │ Transaction Module: transfer_nft                                                                             │
│  │ Sender: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                                   │
│  │ EventType: 0x1b9b3468bcbbc819807130a333c03fd19e2b7b062aa36ac90a8a2b255326bfab::transfer_nft::TreasuryCreated │
│  │ ParsedJSON:                                                                                                  │
│  │   ┌─────────────┬────────────────────────────────────────────────────────────────────┐                       │
│  │   │ treasury_id │ 0x13a222c355e6dd35e3257ab97c314ea5f5b3631e176d647da29a16c29d8e2246 │                       │
│  │   └─────────────┴────────────────────────────────────────────────────────────────────┘                       │
│  └──                                                                                                            │
╰─────────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Object Changes                                                                                             │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Created Objects:                                                                                           │
│  ┌──                                                                                                       │
│  │ ObjectID: 0x13a222c355e6dd35e3257ab97c314ea5f5b3631e176d647da29a16c29d8e2246                            │
│  │ Sender: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                              │
│  │ Owner: Shared( 349180715 )                                                                              │
│  │ ObjectType: 0x1b9b3468bcbbc819807130a333c03fd19e2b7b062aa36ac90a8a2b255326bfab::transfer_nft::Treasury  │
│  │ Version: 349180715                                                                                      │
│  │ Digest: Fzgg4G33HZNCo9tcLMEN4PdeQWyicAjE212iTtFx3i1E                                                    │
│  └──                                                                                                       │
│  ┌──                                                                                                       │
│  │ ObjectID: 0xe6c53aaa27f1ca840810ace4cec5600910f6c64c61c24cd0e3ff6a4993be1767                            │
│  │ Sender: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                              │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )           │
│  │ ObjectType: 0x2::package::UpgradeCap                                                                    │
│  │ Version: 349180715                                                                                      │
│  │ Digest: HQKs9AfmRnGKs6kDby2aLXbyKH1QnYhsjJb6bNtFoYtm                                                    │
│  └──                                                                                                       │
│ Mutated Objects:                                                                                           │
│  ┌──                                                                                                       │
│  │ ObjectID: 0x169fa038f40022143f16ac735e911111c250571465ea02ac4068a3587f283477                            │
│  │ Sender: 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85                              │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )           │
│  │ ObjectType: 0x2::coin::Coin<0x2::sui::SUI>                                                              │
│  │ Version: 349180715                                                                                      │
│  │ Digest: GdUF8wwqM5Fh3sBJTLG8YjCHav8ZEyDNAacAqvmWMs4h                                                    │
│  └──                                                                                                       │
│ Published Objects:                                                                                         │
│  ┌──                                                                                                       │
│  │ PackageID: 0x1b9b3468bcbbc819807130a333c03fd19e2b7b062aa36ac90a8a2b255326bfab                           │
│  │ Version: 1                                                                                              │
│  │ Digest: 6unPHy57oaqe5sU17tRm7zM6XNS8H845rF4YagqiZLyH                                                    │
│  │ Modules: transfer_nft                                                                                   │
│  └──                                                                                                       │
╰────────────────────────────────────────────────────────────────────────────────────────────────────────────╯
╭───────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Balance Changes                                                                                   │
├───────────────────────────────────────────────────────────────────────────────────────────────────┤
│  ┌──                                                                                              │
│  │ Owner: Account Address ( 0x21a9877e440fca354aee0f8d1ad0f19bda846cedc66e420bcaaec47d2624bd85 )  │
│  │ CoinType: 0x2::sui::SUI                                                                        │
│  │ Amount: -23870680                                                                              │
│  └──                                                                                              │
╰───────────────────────────────────────────────────────────────────────────────────────────────────╯

```







# fonctionnement 

Voici comment fonctionne et s’exécute execute_and_burn_transfer(TransferRight, &mut Treasury, ctx) -> Coin<SUI>.

Ce que fait la fonction

- Vérifie que l’appelant est bien owner du NFT et qu’il n’a pas déjà été utilisé.
- Vérifie que la trésorerie partagée a au moins 0.1 SUI.
- Débite 0.1 SUI de la trésorerie et crée un Coin<SUI> “payment”.
- Brûle le NFT (supprime l’objet).
- Émet l’évènement TransferExecuted.
- Retourne le Coin<SUI> “payment” au caller.

Pré‑requis

- Avoir l’ID du NFT TransferRight que tu possèdes: sui client objects --owner <ton_adresse> puis repérer le type <pkg>::transfer_nft::TransferRight.
- Avoir l’ID de la trésorerie partagée (Treasury). Si tu viens de publier, récupère-le via l’évènement:
    - sui client event --query 'MoveEventType = "<pkg>::transfer_nft::TreasuryCreated"' --limit 1
    - ou liste l’objet partagé si tu connais déjà l’ID.

Exécution via le CLI

- Appelle simplement la fonction avec les deux IDs:
    - nft_id: l’ID de ton TransferRight (sera consommé/brûlé)
    - treasury_id: l’ID de l’objet Treasury (shared)
- Commande:
    - sui client call --package <pkg> --module transfer_nft --function execute_and_burn_transfer --args <nft_id> <treasury_id> --gas-budget 10000000
- Résultat:
    - La transaction crée un Coin<SUI> de 0.1 SUI en ta possession. Tu verras l’ID dans “Created Objects” avec Owner = ton adresse.
    - Le NFT n’existe plus (il a été détruit).
    - Un évènement TransferExecuted est émis.

Après l’appel

- Récupère l’ID du coin créé dans “Created Objects”.
- Optionnel: fusionne le paiement avec un autre coin ou transfère-le:
    - Merge: sui client merge-coin --primary-coin <target_coin_id> --coin-to-merge <payment_coin_id> --gas-budget 10000000
    - Transfert: sui client transfer-coin --to <dest_addr> --coin-object-id <payment_coin_id> --gas-budget 10000000

Exécution dans un PTB (JS/TS)

- Pour enchaîner l’appel et le transfert dans une seule transaction:
    - const payment = tx.moveCall({ target: "<pkg>::transfer_nft::execute_and_burn_transfer", arguments: [tx.object(nftId), tx.object(treasuryId)] });
    - tx.transferObjects([payment], tx.pure.address(recipient));

Erreurs possibles

- ENOT_NFT_OWNER si tu n’es pas propriétaire du NFT.
- EALREADY_USED si le NFT a déjà été utilisé.
- EINSUFFICIENT_FUNDS si la trésorerie a un solde < 0.1 SUI.










⸻

Slide – Accessible everywhere

Why does insurance need to be universal? 

Climate change increased farmers’ losses: last year, 1 hundred 23 billion dollars worth of crops are lost— that’s only the beginning. Crop failure is no longer a risk that can be ignored.
Source (https://wfdfi.org/wp-content/uploads/2025/01/116.-The-impact-of-disasters-on-agriculture-and-food-security.pdf)

Take Julius, a farmer living in Malawi who is unbanked.
With Suinsure, he could have been compensated for losing his tomato crops to the drought (draowt) this summer. By subscribing to insurance, he would avoid falling into a spiral of debt.

Source (https://www.theguardian.com/world/2025/aug/23/water-malawai-drought-climate-crisis)

(Include Julius’s photo from the article in the slides, with a caption to show he’s a real person, not invented.)

The worst part? 50% of farmers remain unbanked, Julius’s case is only one of many.
Our goal is to make insurance coverage accessible for everyone, everywhere using the blockchain!

⸻

Slide – Fast reimbursement

Another great advantage of Suinsure is the speed of compensation. You might be asking yourself why speed of compensation is so important?

In the U.S., for example, more than 110 thousand restaurants closed in 2020 due to Covid 19. Why?, you may ask: restaurants have only about 16 days of cash reserves on median. Waiting 60 to 90 days for compensation isn’t a possibility for most. A faster insurance would make a massive difference, avoiding large scale losses of small businesses.

As you know, Sui has ultra-low latency in its transactions, just under 300 thousand per second. This means that even in times of saturation, compensation payments will be able to go through smoothly, with predictable fees.



⸻

Conclusion:


Thanks to the Sui blockchain, Suinsure takes parametric insurance to a whole new level of efficiency, optimizing accessibility, speed and trust. In addition, DeFi guarantees stable revenue, increasing the profit and decreasing the risk. All of these attributes serve as a motor for large scale adoption.






⸻

Project “limits” (find a more positive word for the slides)

projet : concurents 
