<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * OCP - Site Industriel de Gantour
 * Direction Production Benguerir
 * Service de garde et de permanence — Octobre 2025
 *
 * Usage :
 *   php artisan db:seed --class=OcpServicesSeeder
 */
class OcpServicesSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            // ── Activités électriques & réseau ──────────────────────────────
            [
                'name'        => 'Social',
                'description' => 'Service social — MIG/H/A/B — Agent: LACHGAR — Hay Ennasser N°164',
                'sigle'       => 'MIG/H/A/B',
                'agent_name'  => 'LACHGAR',
                'address'     => 'Hay Ennasser N°164',
                'phone'       => '06 72 16 02 29',
            ],
            [
                'name'        => 'Electricité (Réseau) au CI — 1',
                'description' => 'Electricité réseau CI — MIG/M/ER — Agent: BERRAIS — Hay Ennasser N°118',
                'sigle'       => 'MIG/M/ER',
                'agent_name'  => 'BERRAIS',
                'address'     => 'Hay Ennasser N°118',
                'phone'       => '06 66 20 01 52',
            ],
            [
                'name'        => 'Electricité (Réseau) au CI — 2',
                'description' => 'Electricité réseau CI — MIG/M/ER — Agent: CHAMI — S. 2 N°66',
                'sigle'       => 'MIG/M/ER',
                'agent_name'  => 'CHAMI',
                'address'     => 'S. 2 N°66',
                'phone'       => '06 67 01 12 65',
            ],
            [
                'name'        => 'Electricité (Mᵗ Câbles) — 1',
                'description' => 'Electricité monteur câbles — MIG/B/M/E — Agent: TIANE — Hay Ennasser N°394',
                'sigle'       => 'MIG/B/M/E',
                'agent_name'  => 'TIANE',
                'address'     => 'Hay Ennasser N°394',
                'phone'       => '06 62 31 19 38',
            ],
            [
                'name'        => 'Electricité (Mᵗ Câbles) — 2',
                'description' => 'Electricité monteur câbles — MIG/B/M/E — Agent: LACHTANE — Hay Ennasser N°121',
                'sigle'       => 'MIG/B/M/E',
                'agent_name'  => 'LACHTANE',
                'address'     => 'Hay Ennasser N°121',
                'phone'       => '06 66 21 83 51',
            ],
            [
                'name'        => 'Electricité Réparation',
                'description' => 'Electricité réparation — MIG/M/EB — Agent: ELHACHIMI — Hay Riyad 4 N°290',
                'sigle'       => 'MIG/M/EB',
                'agent_name'  => 'ELHACHIMI',
                'address'     => 'Hay Riyad 4 N°290',
                'phone'       => '06 62 32 45 52',
            ],
            [
                'name'        => 'Electronique IF',
                'description' => 'Electronique instrumentation de fond — MIG/B/M/I — Agent: EL KASMI — Hay Riyad 3 N°194',
                'sigle'       => 'MIG/B/M/I',
                'agent_name'  => 'EL KASMI',
                'address'     => 'Hay Riyad 3 N°194',
                'phone'       => '06 62 41 59 26',
            ],
            [
                'name'        => 'Electronique Chantier',
                'description' => 'Electronique chantier — MIG/B/M/I — Agent: ELHAN — Lot Jnane El Khayr N°372',
                'sigle'       => 'MIG/B/M/I',
                'agent_name'  => 'ELHAN',
                'address'     => 'Lot Jnane El Khayr N°372',
                'phone'       => '06 66 99 73 85',
            ],
            [
                'name'        => 'Maintenance Electronique & Télécommunication',
                'description' => 'Maintenance électronique & télécommunication — MIG/M/ET — Agent: BENEMOR — Hay Ennasser N°287',
                'sigle'       => 'MIG/M/ET',
                'agent_name'  => 'BENEMOR',
                'address'     => 'Hay Ennasser N°287',
                'phone'       => '06 61 11 62 54',
            ],

            // ── Magasins ────────────────────────────────────────────────────
            [
                'name'        => 'Magasin — Distribution',
                'description' => 'Magasin distribution — MIG/M/AB — Agent: BOUARIS — Hay Ennasser N°235',
                'sigle'       => 'MIG/M/AB',
                'agent_name'  => 'BOUARIS',
                'address'     => 'Hay Ennasser N°235',
                'phone'       => '06 62 54 50 84',
            ],
            [
                'name'        => 'Magasin — Réception',
                'description' => 'Magasin réception — MIG/M/AB — Agent: AZZAM — Hay El Warda N°27',
                'sigle'       => 'MIG/M/AB',
                'agent_name'  => 'AZZAM',
                'address'     => 'Hay El Warda N°27',
                'phone'       => '06 62 39 25 10',
            ],
            [
                'name'        => 'Magasin — Approvisionnement',
                'description' => 'Magasin approvisionnement — MIG/M/AB — Agent: EL KHADDACHY — HAY Riyad 4 N°170',
                'sigle'       => 'MIG/M/AB',
                'agent_name'  => 'EL KHADDACHY',
                'address'     => 'HAY Riyad 4 N°170',
                'phone'       => '06 59 90 25 17',
            ],

            // ── Utilities & Plomberie ────────────────────────────────────────
            [
                'name'        => 'G.C. & E.P. (Plomberie)',
                'description' => 'Génie civil et équipements de plomberie — MIG/M/P — Agent: FARKACH — Hay Ennasser N°182',
                'sigle'       => 'MIG/M/P',
                'agent_name'  => 'FARKACH',
                'address'     => 'Hay Ennasser N°182',
                'phone'       => '06 62 79 06 84',
            ],
            [
                'name'        => 'Electricité (Cité) — 1',
                'description' => 'Electricité cité — MIG/M/ER — Agent: ILILOU — Hay Ennasser N°400',
                'sigle'       => 'MIG/M/ER',
                'agent_name'  => 'ILILOU',
                'address'     => 'Hay Ennasser N°400',
                'phone'       => '06 66 20 04 79',
            ],
            [
                'name'        => 'Electricité (Cité) — 2',
                'description' => 'Electricité cité — MIG/M/ER — Agent: EL HANTOUTI — S. 5 N°68',
                'sigle'       => 'MIG/M/ER',
                'agent_name'  => 'EL HANTOUTI',
                'address'     => 'S. 5 N°68',
                'phone'       => '06 62 15 66 17',
            ],
            [
                'name'        => 'Climatisation Bâtiment',
                'description' => 'Climatisation bâtiment — MIG/M/ER-B — Agent: LABHAIRI — Lot Ennasser N°151',
                'sigle'       => 'MIG/M/ER-B',
                'agent_name'  => 'LABHAIRI',
                'address'     => 'Lot Ennasser N°151',
                'phone'       => '06 66 03 48 72',
            ],
            [
                'name'        => 'Réseau Eau Potable',
                'description' => 'Réseau eau potable — MIG/M/E-RE — Agent: RADI — Hay Riyad 4 N°209',
                'sigle'       => 'MIG/M/E-RE',
                'agent_name'  => 'RADI',
                'address'     => 'Hay Riyad 4 N°209',
                'phone'       => '06 66 22 02 69',
            ],
            [
                'name'        => 'Réseau Eau Industrielle',
                'description' => 'Réseau eau industrielle — MIG/M/E-RE — Agent: BENBASSOU — Hay El Farah N°68',
                'sigle'       => 'MIG/M/E-RE',
                'agent_name'  => 'BENBASSOU',
                'address'     => 'Hay El Farah N°68',
                'phone'       => '06 72 14 62 84',
            ],
            [
                'name'        => 'STEP',
                'description' => 'Station d\'épuration — MIG/M/ER-E — Agent: ETTAHIRI — S. 14 N°101',
                'sigle'       => 'MIG/M/ER-E',
                'agent_name'  => 'ETTAHIRI',
                'address'     => 'S. 14 N°101',
                'phone'       => '06 82 26 75 47',
            ],

            // ── HSE ─────────────────────────────────────────────────────────
            [
                'name'        => 'HSE — Production Support',
                'description' => 'HSE production support — MIG/B/H — Agent: EL KOUTARI — Hay Riad 2 N°313',
                'sigle'       => 'MIG/B/H',
                'agent_name'  => 'EL KOUTARI',
                'address'     => 'Hay Riad 2 N°313',
                'phone'       => '06 62 79 08 76',
            ],
            [
                'name'        => 'HSE — Production Extraction',
                'description' => 'HSE production extraction — MIG/B/H — Agent: RHRISSA — Lotissement Jnane Elkheir N°2013',
                'sigle'       => 'MIG/B/H',
                'agent_name'  => 'RHRISSA',
                'address'     => 'Lotissement Jnane Elkheir N°2013',
                'phone'       => '06 62 79 28 41',
            ],
            [
                'name'        => 'HSE — Production Maintenance',
                'description' => 'HSE production maintenance — MIG/B/H — Agent: HAIRECH — Hay Ennasser N°280',
                'sigle'       => 'MIG/B/H',
                'agent_name'  => 'HAIRECH',
                'address'     => 'Hay Ennasser N°280',
                'phone'       => '06 62 36 45',
            ],
            [
                'name'        => 'HSE — Moyens Généraux',
                'description' => 'HSE moyens généraux — MIG/M/H — Agent: ELGARDHA — S. 15 N°439',
                'sigle'       => 'MIG/M/H',
                'agent_name'  => 'ELGARDHA',
                'address'     => 'S. 15 N°439',
                'phone'       => '06 66 20 44 36',
            ],

            // ── Ateliers ────────────────────────────────────────────────────
            [
                'name'        => 'Atelier S/Ensembles',
                'description' => 'Atelier sous-ensembles — MIG/M/R — Agent: AZERGUI — Hay Ennasser N°297',
                'sigle'       => 'MIG/M/R',
                'agent_name'  => 'AZERGUI',
                'address'     => 'Hay Ennasser N°297',
                'phone'       => '06 66 09 96 51',
            ],
            [
                'name'        => 'Atelier Camions et Chargeuses',
                'description' => 'Atelier camions et chargeuses — MIG/B/M/C — Agent: ACHLOUL — S. 6 N°B13',
                'sigle'       => 'MIG/B/M/C',
                'agent_name'  => 'ACHLOUL',
                'address'     => 'S. 6 N°B13',
                'phone'       => '06 66 13 10 36',
            ],
            [
                'name'        => 'Atelier Bulls & Sondeuses',
                'description' => 'Atelier bulls et sondeuses — MIG/B/M/C — Agent: BOUSSEMAH — S. 15 N°545',
                'sigle'       => 'MIG/B/M/C',
                'agent_name'  => 'BOUSSEMAH',
                'address'     => 'S. 15 N°545',
                'phone'       => '06 66 99 56 93',
            ],
            [
                'name'        => 'Atelier Electrique Engins',
                'description' => 'Atelier électrique engins — MIG/B/M/C — Agent: CAMMACH — Hay Ennasser N°133',
                'sigle'       => 'MIG/B/M/C',
                'agent_name'  => 'CAMMACH',
                'address'     => 'Hay Ennasser N°133',
                'phone'       => '06 62 13 77 28',
            ],
            [
                'name'        => 'Station Services',
                'description' => 'Station services — MIG/B/M/C — Agent: BOUSSKINE — Hay Ennasser N°329',
                'sigle'       => 'MIG/B/M/C',
                'agent_name'  => 'BOUSSKINE',
                'address'     => 'Hay Ennasser N°329',
                'phone'       => '06 66 90 63 72',
            ],
            [
                'name'        => 'Maintenance Froid et Climatisation des Engins',
                'description' => 'Maintenance froid et climatisation engins — MIG/B/M/CE — Agent: HOUSNI — Hay Ennasser N°370',
                'sigle'       => 'MIG/B/M/CE',
                'agent_name'  => 'HOUSNI',
                'address'     => 'Hay Ennasser N°370',
                'phone'       => '06 66 99 78 56',
            ],

            // ── Secteurs Electriques IF ──────────────────────────────────────
            [
                'name'        => 'Secteur Electrique IF Epierrage',
                'description' => 'Secteur électrique IF épierrage — MIG/B/M/E — Agent: WISTOULI — Hay Ennasser N°408',
                'sigle'       => 'MIG/B/M/E',
                'agent_name'  => 'WISTOULI',
                'address'     => 'Hay Ennasser N°408',
                'phone'       => '06 73 35 12 09',
            ],
            [
                'name'        => 'S. Electrique IF Criblage & Chargement Trains',
                'description' => 'Secteur électrique IF criblage & chargement trains — MIG/B/M/E — Agent: ELAALLAOUI — Hay Ennasser N°92',
                'sigle'       => 'MIG/B/M/E',
                'agent_name'  => 'ELAALLAOUI',
                'address'     => 'Hay Ennasser N°92',
                'phone'       => '06 67 23 10 04',
            ],
            [
                'name'        => 'Electrique Dragline',
                'description' => 'Electrique dragline — MIG/B/M/ED — Agent: EL BIAD — Hay RIAD 2 N°274',
                'sigle'       => 'MIG/B/M/ED',
                'agent_name'  => 'EL BIAD',
                'address'     => 'Hay RIAD 2 N°274',
                'phone'       => '06 62 22 50 21',
            ],

            // ── Extract ─────────────────────────────────────────────────────
            [
                'name'        => 'Extract — Chantier Trav. Préparatoires',
                'description' => 'Extraction chantier travaux préparatoires — MIG/B/E — Agent: KANSOUSI — S. 5 N°39',
                'sigle'       => 'MIG/B/E',
                'agent_name'  => 'KANSOUSI',
                'address'     => 'S. 5 N°39',
                'phone'       => '06 61 06 55 01',
            ],
            [
                'name'        => 'Extract — Chantier Défruitage/Aménagement',
                'description' => 'Extraction chantier défruitage et aménagement — MIG/B/E — Agent: LAFHAL — Hay Ennasser N°174',
                'sigle'       => 'MIG/B/E',
                'agent_name'  => 'LAFHAL',
                'address'     => 'Hay Ennasser N°174',
                'phone'       => '06 62 13 78 43',
            ],
            [
                'name'        => 'Extract IF — Epierrage',
                'description' => 'Extraction IF épierrage — MIG/B/E/F — Agent: EL MOUNTASSIR — Hay Ennasser N°131',
                'sigle'       => 'MIG/B/E/F',
                'agent_name'  => 'EL MOUNTASSIR',
                'address'     => 'Hay Ennasser N°131',
                'phone'       => '06 62 34 44 04',
            ],
            [
                'name'        => 'Extract IF — Criblage et Chargement',
                'description' => 'Extraction IF criblage et chargement — MIG/B/E/F — Agent: EZZAHRAOUI — Hay Ennasser N°255',
                'sigle'       => 'MIG/B/E/F',
                'agent_name'  => 'EZZAHRAOUI',
                'address'     => 'Hay Ennasser N°255',
                'phone'       => '06 73 34 22 61',
            ],

            // ── Chargement Trains ────────────────────────────────────────────
            [
                'name'        => 'Chargement Trains — Flux Gantour & Cabine de Pilotage',
                'description' => 'Chargement trains communication avec flux Gantour et cabine de pilotage — MIG/B/E — Agent: ECHAMEKH — Riyad 4 Lot. Mesk Ellil N°H4',
                'sigle'       => 'MIG/B/E',
                'agent_name'  => 'ECHAMEKH',
                'address'     => 'Riyad 4, Lot. Mesk Ellil N°H4',
                'phone'       => '06 62 02 46 97',
            ],

            // ── IF Mécanique ─────────────────────────────────────────────────
            [
                'name'        => 'IF Mécanique — Chargement et Criblage',
                'description' => 'IF mécanique chargement et criblage — MIG/B/E/F/I — Agent: EL FAQUIRI — Lotissement El Qods N°45',
                'sigle'       => 'MIG/B/E/F/I',
                'agent_name'  => 'EL FAQUIRI',
                'address'     => 'Lotissement El Qods N°45',
                'phone'       => '06 62 22 36 93',
            ],
            [
                'name'        => 'IF Mécanique — Epierrage',
                'description' => 'IF mécanique épierrage — MIG/B/E/F/I — Agent: OUASLAMI — S. 13',
                'sigle'       => 'MIG/B/E/F/I',
                'agent_name'  => 'OUASLAMI',
                'address'     => 'S. 13',
                'phone'       => '06 62 10 09 36',
            ],
            [
                'name'        => 'Vulcanisation Installations Fixes',
                'description' => 'Vulcanisation installations fixes — MIG/B/E/F/I — Agent: EL GHOUL — Hay Riyad 2 N°288',
                'sigle'       => 'MIG/B/E/F/I',
                'agent_name'  => 'EL GHOUL',
                'address'     => 'Hay Riyad 2 N°288',
                'phone'       => '06 66 22 01 81',
            ],
            [
                'name'        => 'Atelier Répar. Garage',
                'description' => 'Atelier réparation garage — MIG/M/M/L — Agent: MEHRACHE — Jnane El Khair N°324',
                'sigle'       => 'MIG/M/M/L',
                'agent_name'  => 'MEHRACHE',
                'address'     => 'Jnane El Khair N°324',
                'phone'       => '06 62 26 42 70',
            ],
            [
                'name'        => 'Contrôle Matériel',
                'description' => 'Contrôle matériel — MIG/M/AC — Agent: HABLY — Hay Ennasser N°104',
                'sigle'       => 'MIG/M/AC',
                'agent_name'  => 'HABLY',
                'address'     => 'Hay Ennasser N°104',
                'phone'       => '06 62 13 77 94',
            ],
            [
                'name'        => 'Mécanique Dragline',
                'description' => 'Mécanique dragline — MIG/B/M/D — Agent: LAMSAHEL — Secteur 13 N°339',
                'sigle'       => 'MIG/B/M/D',
                'agent_name'  => 'LAMSAHEL',
                'address'     => 'Secteur 13 N°339',
                'phone'       => '06 66 84 36 75',
            ],
            [
                'name'        => 'Section Géologie',
                'description' => 'Section géologie — MIG/B/P/G — Agent: BOUZALMANE — Hay El Farah Groupe 5 N°305',
                'sigle'       => 'MIG/B/P/G',
                'agent_name'  => 'BOUZALMANE',
                'address'     => 'Hay El Farah Groupe 5 N°305',
                'phone'       => '06 62 22 81 63',
            ],

            // ── FIM ─────────────────────────────────────────────────────────
            [
                'name'        => 'FIM — Growth Program Gantour (Bougrine)',
                'description' => 'FIM growth program Gantour — FIM/TG — Agent: BOUGRINE — S. 15 N°443',
                'sigle'       => 'FIM/TG',
                'agent_name'  => 'BOUGRINE',
                'address'     => 'S. 15 N°443',
                'phone'       => '06 67 19 69 89',
            ],
            [
                'name'        => 'FIM — Growth Program Gantour (Driouich)',
                'description' => 'FIM growth program Gantour — FIM/TG — Agent: DRIOUICH — HAY Riyad 4 N°480',
                'sigle'       => 'FIM/TG',
                'agent_name'  => 'DRIOUICH',
                'address'     => 'HAY Riyad 4 N°480',
                'phone'       => '06 62 01 77 83',
            ],

            // ── Sûreté & Bureau ──────────────────────────────────────────────
            [
                'name'        => 'Sûreté des Installations BG',
                'description' => 'Sûreté des installations Benguerir — MIG/S/B — Agent: CHAHBOUNIA — Hay Riyad N°440',
                'sigle'       => 'MIG/S/B',
                'agent_name'  => 'CHAHBOUNIA',
                'address'     => 'Hay Riyad N°440',
                'phone'       => '06 42 48 06 08',
            ],
            [
                'name'        => 'Bureau d\'études',
                'description' => 'Bureau d\'études — MIG/M/T-BE — Agent: CHANI — Hay Ennasser N°392',
                'sigle'       => 'MIG/M/T-BE',
                'agent_name'  => 'CHANI',
                'address'     => 'Hay Ennasser N°392',
                'phone'       => '06 66 83 38 72',
            ],
        ];

        $now = now();

        foreach ($services as $service) {
            // Vérifie si le service existe déjà pour éviter les doublons
            $exists = DB::table('services')->where('name', $service['name'])->exists();

            if (!$exists) {
                DB::table('services')->insert([
                    'name'        => $service['name'],
                    'description' => $service['description'],
                    'created_at'  => $now,
                    'updated_at'  => $now,
                ]);
            }
        }

        $this->command->info('✅ ' . count($services) . ' services OCP importés avec succès (Benguerir, Oct 2025).');
    }
}