import { ISurveyBoxRequest, ITask } from '/project/shared'
import { MKNBase } from '@Backend/models'

/**
 * @description
 * ```
 * private __expired: idicate wheather task is still available or not
 * private countdown: if the task has deadLineAt count until task deadLineAt
 * private setExpired: mark the task is expired
 * private __tasks: store all task
 * ```
 */
export interface Task extends ITask {}
export class Task 
  extends MKNBase<ITask>
  implements ITask 
{

  private __stores: TTasks[] = []

  private __expired = false

  constructor(props: ITask){
    super(props)
    Object.assign(this, props)
    if(props.deadLineAt) this.countdown(props.deadLineAt)
  }

  get expired() { return this.__expired }
  
  private countdown(deadLine: string) {
    const current = new Date().getTime()
    if(current >= +deadLine){ 
      // task is expired no longer check
      return this.setExpired()
    }
    setTimeout(() => this.countdown(deadLine), 1000)
  }

  private setExpired() { 
    this.__expired = true 
    /**
     * write to mysql table
     */
  }

  public static loadTasks(){
    /**
     * mysql query `tasks`
     * .then(tasks => tasks.map(task => {
     * 
     * }))
     * .then(instance_tasks => Task.__store = instance_tasks)
     */
  }
}

interface SurveyBoxRequest extends ISurveyBoxRequest {}
class SurveyBoxRequest 
    extends Task
    implements ISurveyBoxRequest
{
  constructor(props: ISurveyBoxRequest){
    super(props)
    Object.assign(this, props)
  }
}

export type TTasks = SurveyBoxRequest