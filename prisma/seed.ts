import {
    PrismaClient,
    Doll,
    NeuralHelixKey,
    Attribute,
    ReleaseCountry,
    Role,
    Rare,
    NeuralHelixType
} from "../src/generated/prisma";
import fs from "node:fs";
import { createInterface } from "node:readline";
import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path";

const prisma = new PrismaClient();
const filename = "dolls.jsonl";
const __dirname = dirname(fileURLToPath(import.meta.url));
const filePath = path.join(__dirname, filename);

console.log(filePath);

async function* readJsonLine(filePath: string) {
    const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
    const rl = createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    for await (const line of rl) {
        try {
            if (line.trim() === "") continue;
            yield JSON.parse(line);
        } catch (error) {
            console.error("Error parsing line: ", error, "\nLine: ", line);
        }
    }
}

const rareMap = {
    sr: Rare.SR,
    ssr: Rare.SSR
};

const roleMap = {
    sentinel: Role.SENTINEL,
    support: Role.SUPPORT,
    bulwark: Role.BULWARK,
    vanguard: Role.VANGUARD
};

const attributeMap = {
    light: Attribute.LIGHT_AMMO,
    standard: Attribute.MEDIUM_AMMO,
    heavy: Attribute.HEAVY_AMMO,
    shotgun: Attribute.SHOTGUN_AMMO,
    melee: Attribute.MELEE,
    fire: Attribute.BURN,
    poison: Attribute.CORROSION,
    water: Attribute.HYDRO,
    ice: Attribute.FREEZE,
    electric: Attribute.ELECTRIC
};

const statusMap = {
    attack: "attack",
    defense: "defense",
    health: "health",
    stability: "stability",
    crit_rate: "criticalRate",
    crit_damage: "criticalDamage",
    attack_bonus: "attackBonus",
    defense_bonus: "defenseBonus",
    health_bonus: "healthBonus",
    mobility: "mobility"
};

const specialHelixTypeMap = {
    common: NeuralHelixType.COMMON,
    mod: NeuralHelixType.EXTENSION,
    common_love: NeuralHelixType.COMMON_LOVE
};

const uniqueHelixTypeMap = {
    "2-01": NeuralHelixType.UNIQUE_201,
    "2-03": NeuralHelixType.UNIQUE_203,
    "4-01": NeuralHelixType.UNIQUE_401,
    "4-03": NeuralHelixType.UNIQUE_403,
    "6-01": NeuralHelixType.UNIQUE_601,
    "6-03": NeuralHelixType.UNIQUE_603
};

const releaseMap = {
    cn: ReleaseCountry.CN,
    ko: ReleaseCountry.KO
};

const resolveAttributes = (name: string): Attribute => {
    const attribute = attributeMap[name];
    if (!attribute) {
        throw new Error(`Invalid attribute: ${name}`);
    }
    return attribute;
};

const resolveRelease = (name: string): ReleaseCountry => {
    const release = releaseMap[name];
    if (!release) {
        throw new Error(`Invalid release: ${name}`);
    }
    return release;
};

const resolveHelixType = (type: string): NeuralHelixType => {
    const helixType = uniqueHelixTypeMap[type] || specialHelixTypeMap[type];
    if (!helixType) {
        throw new Error(`Invalid helix type: ${type}`);
    }
    return helixType;
};

const resolveStatus = (status: string) => {
    const st = statusMap[status];
    if (!st) {
        throw new Error(`Invalid status: ${status}`);
    }
    return st;
};

const parseDoll = (jsonObject: any): Omit<Doll, "id" | "opinionId" | "statusId"> => {
    const en_name = jsonObject.id;
    const ko_name = jsonObject.name;
    const description = jsonObject.description;
    const role = roleMap[jsonObject.role.id];
    const rare = rareMap[jsonObject.rare];
    const affinities = jsonObject.affinities.id.map((id: string) => resolveAttributes(id));
    const weaknesses = jsonObject.weaknesses.id.map((id: string) => resolveAttributes(id));
    const release = jsonObject.release.map((name: string) => resolveRelease(name));
    return {
        en_name,
        ko_name,
        description,
        role,
        rare,
        affinities,
        weaknesses,
        release
    };
};

const parseStatus = (status: any) => {
    const st = status as { [key: string]: number };
    const res = {};

    try {
        Object.entries(st).forEach(([key, value]) => {
            res[resolveStatus(key)] = value;
        });
    } catch (error) {
        console.error("Error parsing status: ", error, "\nStatus: ", status);
    }

    return res;
};

const parseUniqueHelix = (
    unique: any
): Omit<NeuralHelixKey, "id" | "dollId" | "statusBonusId">[] => {
    return Object.entries(unique).map(([key, value]: [string, any]) => {
        return {
            type: resolveHelixType(key),
            name: value.name,
            description: value.description,
            isCommon: false
        };
    });
};

const parseSpecialHelix = (
    special: any
): Omit<NeuralHelixKey, "id" | "dollId" | "statusBonusId">[] => {
    return Object.entries(special)
        .filter(([key, value]: [string, any]) => value.name.trim() !== "")
        .map(([key, value]: [string, any]) => {
            return {
                type: resolveHelixType(key),
                name: value.name,
                description: value.description,
                isCommon: false,
                ...(value.status ? { statusBonus: { create: parseStatus(value.status) } } : {})
            };
        });
};

async function main() {
    for await (const jsonObject of readJsonLine(filePath)) {
        const doll = parseDoll(jsonObject);
        const status = parseStatus(jsonObject.status);
        const uniqueHelix = parseUniqueHelix(jsonObject.neural_helix.unique);
        const specialHelix = parseSpecialHelix(jsonObject.neural_helix.special);

        try {
            const result = await prisma.doll.create({
                data: {
                    ...doll,
                    status: {
                        create: status
                    },
                    opinion: {
                        create: {
                            comments: {
                                create: []
                            },
                            upvote: 0,
                            downvote: 0
                        }
                    },
                    neuralHelixes: {
                        create: [...uniqueHelix, ...specialHelix]
                    }
                }
            });
            console.log("Created doll: ", result.ko_name);
        } catch (error) {
            console.error("Error creating doll: ", error, "\nDoll: ", doll);
        }
    }
}

main().catch(console.error);
