export type Remi = {
  "version": "0.1.0",
  "name": "remi",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fromAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "mintAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapSolForToken",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapTokenForSol",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "app",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "ata",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AppAtaAddressesDoNotMatch"
    },
    {
      "code": 6001,
      "name": "SenderInsufficientBalance"
    },
    {
      "code": 6002,
      "name": "AppInsufficientBalance"
    },
    {
      "code": 6003,
      "name": "BumpNotFound"
    }
  ]
};

export const IDL: Remi = {
  "version": "0.1.0",
  "name": "remi",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "ata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "signer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "addLiquidity",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "from",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "fromAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        },
        {
          "name": "mintAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapSolForToken",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "solAmount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "swapTokenForSol",
      "accounts": [
        {
          "name": "app",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "appAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "sender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "senderAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "tokenAmount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "app",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "mint",
            "type": "publicKey"
          },
          {
            "name": "ata",
            "type": "publicKey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AppAtaAddressesDoNotMatch"
    },
    {
      "code": 6001,
      "name": "SenderInsufficientBalance"
    },
    {
      "code": 6002,
      "name": "AppInsufficientBalance"
    },
    {
      "code": 6003,
      "name": "BumpNotFound"
    }
  ]
};
