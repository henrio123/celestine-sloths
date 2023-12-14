import { useQuery, gql } from '@apollo/client';

import { GenericNFTCard } from "./GenericNFTCard";
import { useEffect, useMemo, useState } from "react";
import { toUtf8 } from "@cosmjs/encoding";
import { useChain } from "@cosmos-kit/react";
import { cosmwasm, getSigningCosmwasmClient } from "stargazejs";
import BN from 'bignumber.js'

import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";

import toast from "react-hot-toast";

const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;

const STARGAZE_MARKET_CONTRACT =
  "stars1fvhcnyddukcqfnt7nlwv3thm5we22lyxyxylr9h77cvgkcn43xfsvgv0pl";

function createBuyNftTx({
  sender,
  collection,
  tokenId,
  expiry,
  funds,
}: {
  sender: string;
  collection: string;
  tokenId: number;
  expiry: string;
  funds: Array<{ amount: string; denom: string }>;
}) {
  const tx = {
    msg: {
      buy_now: {
        collection: collection,
        token_id: tokenId,
        expires: expiry,
      },
    },
    memo: "",
    funds: funds,
  };

  const executeContractTx = executeContract({
    sender: sender,
    contract: STARGAZE_MARKET_CONTRACT,
    msg: toUtf8(JSON.stringify(tx.msg)),
    funds: funds,
  });

  console.log("logging execute contract tx", executeContractTx);

  return {
    typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
    value: executeContractTx.value,
  };
}

const getNFTTokensQuery = gql`
  query Tokens($collectionAddr: String!, $limit: Int, $offset: Int, $filterForSale: SaleType, $sortBy: TokenSort) {
  tokens(collectionAddr: $collectionAddr, limit: $limit, offset: $offset, filterForSale: $filterForSale, sortBy: $sortBy) {
    tokens {
      description
      name
      rarityOrder
      owner {
        address
      }
      collection {
        tokenCounts {
          total
        }
        media {
          type
          url
        }
        name
        contractAddress
      }
      listedAt
      listPrice {
        amount
        denom
      }
      media {
        type
        url
      }
      metadata
      traits {
        name
        rarity
        rarityPercent
        rarityScore
      }
      
      tokenId
      tokenUri
      saleType
      owner {
        address
      }
    } 
}
  }`;

const BAD_KIDS_COLLECTION =
  "stars19jq6mj84cnt9p7sagjxqf8hxtczwc8wlpuwe4sh62w45aheseues57n420";
const SASQUATCH_SOCIETY_COLLECTION =
  "stars1edsg4rct2h5t4wawysxhef0mzprpcfsn5v8cxklj65uf2kkpvs8shk4pre";

export function NFTs() {
  const { address, chain, getOfflineSignerDirect, openView } = useChain("stargaze");

  const [balance, setBalance] = useState<string>("0");


  const {loading, error, data: result, fetchMore} = useQuery(getNFTTokensQuery, {
    variables: {
      collectionAddr: BAD_KIDS_COLLECTION,
      limit: 10,
      offset: 10,
      filterForSale: "FIXED_PRICE",
      sortBy: "PRICE_ASC",
    }
  });

  useEffect(() => {
    const getBalance = async () => {
      const res = await fetch(`${chain.apis?.rest?.[0].address}/cosmos/bank/v1beta1/balances/${address}`)
      const response = await res.json()
      const starsBalance = response.balances.find((balance: any) => balance.denom === "ustars").amount;
      setBalance(starsBalance);
    };
    if(address){
      getBalance();
    }
  }, [address])

  useEffect(() => {
    const handleScroll = () => {
      const totalPageHeight = document.documentElement.scrollHeight;
      const scrollPoint = window.scrollY + window.innerHeight;
      if (scrollPoint >= totalPageHeight) {
        toast(`Loading more Bad Kids`, {position: "bottom-center"})
        fetchMore({
          variables: {
            offset: result?.tokens?.tokens?.length + 10,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return Object.assign({}, prev, {
              tokens: { tokens: [...prev.tokens.tokens, ...fetchMoreResult.tokens.tokens] },
            });
          }
        })
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  const nfts = useMemo(() => {
    return result?.tokens?.tokens?.filter((token: any) => token.owner.address !== address)
      .map((token: any) => {
        let cta = "Connect Wallet"
        if(address){
          cta = BN(balance).gt(token.listPrice.amount) ? "Buy Now" : "Get Stars"
        }

        return {
          image: token.media.url,
          media_type: token.media.type,
          name: token.metadata.name,
          tokenId: token.tokenId,
          listPrice: token.listPrice,
          traits: token.traits,
          rarityOrder: token.rarityOrder,
          cta,
          collection: {
            name: token.collection.name,
            media_type: token.collection.media.type,
            image: token.collection.media.url,
            contractAddress: token.collection.contractAddress,
            tokenCount: token.collection.tokenCounts.total,
          },
        };
      });
  }, [result, balance]);

  const onnNFTClick = async (nft: any) => {
    if (!address) {
      openView();
      return;
    };
    if(nft.cta === "Get Stars"){
      window.open("https://cosmos.leapwallet.io/transact/swap", "_blank")
      return;
    }
 
    try {
      toast(`Please sign the transaction on your wallet`)
      const twoWeekExpiry = 14 * 24 * 60 * 60 * 1000;
      const tx = createBuyNftTx({
        sender: address,
        collection: nft.collection.contractAddress,
        tokenId: parseInt(nft.tokenId),
        expiry: ((Date.now() + twoWeekExpiry) * 1000_000).toString(),
        funds: [
          {
            denom: nft.listPrice.denom,
            amount: nft.listPrice.amount,
          },
        ],
      });
  
      const signer = getOfflineSignerDirect();
  
      const signingCosmwasmClient = await getSigningCosmwasmClient({
        rpcEndpoint: chain.apis?.rpc?.[0].address ?? "",
        signer: signer,
      });
  
      const fee = {
        amount: [
          {
            amount: "0",
            denom: "ustars",
          },
        ],
        gas: "1000000",
      };
  
      const signedTx = await signingCosmwasmClient.sign(address, [tx], fee, "");
      const txRaw = TxRaw.encode({
        bodyBytes: signedTx.bodyBytes,
        authInfoBytes: signedTx.authInfoBytes,
        signatures: signedTx.signatures,
      }).finish();
  
      const res = await signingCosmwasmClient.broadcastTx(txRaw);
      
      toast.success(`Transaction sent successfully`)
      
    }catch(e: any){
      toast.error(`Error: ${e.message}`)

    }
  };

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-3 rounded-3xl border-[0] border-gray-100 p-0 shadow-[0_7px_24px_0px_rgba(0,0,0,0.25)] shadow-[0] dark:border-gray-900 sm:gap-x-6 sm:gap-y-8 sm:border sm:!p-6">
      {nfts &&
        nfts.map((nft: any) => (
          <GenericNFTCard
            nft={nft}
            key={nft.tokenId}
            onNFTClick={onnNFTClick}
          />
        ))}
    </div>
  );
}