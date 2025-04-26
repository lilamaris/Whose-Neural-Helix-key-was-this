export interface DollRole {
    id: string;
    name: string;
}

export interface Affinities {
    id: string[];
    name: string[];
}

export interface Weaknesses {
    id: string[];
    name: string[];
}

export type SkillType = "attack" | "active_1" | "active_2" | "ultimate" | "passive";

export interface DollFortification {
    segment: number;
    target_skill: SkillType;
    description: string;
}

export interface DollSkill {
    type: SkillType;
    name: string;
    affinities: Affinities;
    stability_damage: number;
    skill_description: string;
    description: string;
    confectance_point: number;
    cooldown: number;
}

export interface DollStatus {
    attack: number;
    defense: number;
    health: number;
    stability: number;
    crit_rate: number;
    crit_damage: number;
    attack_bonus: number;
    defense_bonus: number;
    health_bonus: number;
    mobility: number;
}

export interface NeuralHelixKey {
    name: string;
    description: string;
    status: Record<keyof DollStatus, number>;
    condition_status: Record<keyof DollStatus, number>;
}

export enum UniqueNeuralHelixType {
    "2-01" = "2-01",
    "2-03" = "2-03",
    "4-01" = "4-01",
    "4-03" = "4-03",
    "6-01" = "6-01",
    "6-03" = "6-03"
}
export type Release = ("cn" | "ko")[];

export enum SpecialNeuralHelixType {
    common = "common", // 공용키
    extension = "extension", // 확장키
    common_love = "common_love" // 결합도 공용키
}

export interface Doll {
    id: string;
    name: string;
    rare: "sr" | "ssr";
    role: DollRole;
    affinities: Affinities;
    weaknesses: Weaknesses;
    description: string;
    status: DollStatus;
    skills: [DollSkill, DollSkill, DollSkill, DollSkill, DollSkill];
    fortification: [
        DollFortification,
        DollFortification,
        DollFortification,
        DollFortification,
        DollFortification,
        DollFortification
    ];
    neural_helix: {
        unique: Record<UniqueNeuralHelixType, NeuralHelixKey>;
        special: Record<SpecialNeuralHelixType, NeuralHelixKey>;
    };
    release: Release;
}

export interface DollUnit extends Pick<Doll, "id" | "name" | "rare" | "role" | "status"> {
    assignedHelixes: NeuralHelixKey[];
}

export interface PreferHelixKey {
    id: string; // 대상 Doll의 Id
    preferCommonKey: string[]; // 추천 공용키의 Doll Id 배열
    preferStatus: Record<keyof DollStatus, number>; // 추천 결합키 보너스 수치
}

export interface Party {
    id: number;
    dolls: DollUnit[];
}
