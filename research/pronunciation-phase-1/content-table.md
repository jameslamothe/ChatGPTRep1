# Ten-character content draft

Prepared 26 October 2026. **Not independently verified or approved for implementation.**

Updated source check: the accessible Slice of Thai chart supports the initial sounds of all ten entries and the word transcriptions for ไก่, ไข่ and จาน. The linked consonant-shape chart also supports all ten full-name phonetic sequences and tones, including the mnemonic-word pronunciations. Independent native-speaker verification remains pending; seven word meanings have not been dictionary-checked during this task. See [source-findings.md](source-findings.md). The table is a proposal, not a claim of complete verification.

| Letter | Existing ID | Full spoken name | Existing tone-marked name | Example word · romanization · meaning | Start IPA | End IPA |
| --- | --- | --- | --- | --- | --- | --- |
| ก | thai-0 | กอ ไก่ | kō kài | ไก่ · kài · chicken | /k/ | /k̚/ |
| ข | thai-1 | ขอ ไข่ | khǒ khài | ไข่ · khài · egg | /kʰ/ | /k̚/ |
| ค | thai-3 | คอ ควาย | khō khwāi | ควาย · khwāi · water buffalo | /kʰ/ | /k̚/ |
| ง | thai-6 | งอ งู | ngō ngū | งู · ngū · snake | /ŋ/ | /ŋ/ |
| จ | thai-7 | จอ จาน | chō chān | จาน · chān · plate | /tɕ/ | /t̚/ |
| ช | thai-9 | ชอ ช้าง | chō cháng | ช้าง · cháng · elephant | /tɕʰ/ | /t̚/ |
| ด | thai-19 | ดอ เด็ก | dō dèk | เด็ก · dèk · child | /d/ | /t̚/ |
| ต | thai-20 | ตอ เต่า | tō tào | เต่า · tào · turtle | /t/ | /t̚/ |
| บ | thai-25 | บอ ใบไม้ | bō bāi-mái | ใบไม้ · bāi-mái · leaf | /b/ | /p̚/ |
| ป | thai-26 | ปอ ปลา | pō plā | ปลา · plā · fish | /p/ | /p̚/ |

The existing shorthand labels (for example ก ไก่) and expanded recording scripts (กอ ไก่) refer to the same conventional name. Do not silently replace existing UI labels or romanization. The name includes a vowel; its pronunciation is different from the isolated initial consonant.

The app uses ā mid, à low, â falling, á high, ǎ rising; those marks are tones, not vowel length. In particular its o in the letter names represents a long open-o vowel /ɔː/. IPA uses ː for length, ʰ for aspiration, and ◌̚ for an unreleased ending. The proposed whole-word IPA uses pitch levels: ˧ mid, ˨˩ low, ˩˩˦ rising, ˦˥ high. Pitch shapes are broad teaching approximations. They must be checked alongside the recordings.

For North American English learners, retain the short aspiration hints already in the app. Check that recordings preserve /k/ versus /kʰ/, /tɕ/ versus /tɕʰ/, /t/ versus /d/, /p/ versus /b/, and syllable-initial /ŋ/. English examples are approximate. จ is not English j /dʒ/. For the example ปลา, preserve the initial /pl/ cluster. For ใบไม้, record both syllables.
