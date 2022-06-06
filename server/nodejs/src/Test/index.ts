import { EFlags } from "/project/shared"
import { AppDataSource,
  AccountRepository, FlagsRepository
} from "../data-source"
import { Equal } from "typeorm"


AppDataSource.initialize().then(
  async connection => {
    await connection.synchronize()

    for(const e in EFlags){
      FlagsRepository.insert({
        flagId: e,
        flagDescription: 'description of ' + e
      })
    }
})
