import wallet from "../../Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    UpdateMetadataAccountV2InstructionAccounts,
    updateMetadataAccountV2,
    fetchMetadataFromSeeds
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

// Define our Mint address
const mint = publicKey("62hLevDvm2kowvfHjNwLrdnCTQ9pmJeYbyu8Z6nDfdhv")

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

// Create
// (async () => {
//     try {
//         // Start here
//         let accounts: CreateMetadataAccountV3InstructionAccounts = {
//             mint,
//             mintAuthority: signer,
//         }

//         let data: DataV2Args = {
//             name: "chibi",
//             symbol: "CH",
//             uri: "https://drive.google.com/file/d/1fE-RWsXWne0UYmNB5Or4m0ZzjEbfm2DY/view?usp=sharing",
//             sellerFeeBasisPoints: 15,
//             creators: [{address: keypair.publicKey, verified: true, share: 100}],
//             collection: null,
//             uses: null
//         }

//         let args: CreateMetadataAccountV3InstructionArgs = {
//             data,
//             isMutable: true,
//             collectionDetails: null
//         }

//         let tx = createMetadataAccountV3(
//             umi,
//             {
//                 ...accounts,
//                 ...args
//             }
//         )

//         let result = await tx.sendAndConfirm(umi);
//         console.log(bs58.encode(result.signature));
//     } catch(e) {
//         console.error(`Oops, something went wrong: ${e}`)
//     }
// })();

// Update
(async () => {
    try {
        let metadata = await fetchMetadataFromSeeds(umi, { mint });

        let accounts: UpdateMetadataAccountV2InstructionAccounts = {
            metadata: metadata.publicKey,
        }

        let update = updateMetadataAccountV2(umi, { 
            ...accounts,
            data: { ...metadata, uri: "https://raw.githubusercontent.com/Naty-S/Turbin3_Q3_25_Builders/main/static/CH/metadata.json"}
        });

        let result = await update.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));

    } catch (e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
