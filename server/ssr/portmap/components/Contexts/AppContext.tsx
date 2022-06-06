import React from 'react'
import { useModal } from './ModalContext'
import { InputModal, useInputModal } from './ModalInputContext'
import { consumeAPI, AppService } from '/project/clients/Services'
import { StringVerify, IDepartmentDTO, IUserDTO, IUserPositionDTO, ICreateUserDTO } from '/project/shared'
import { ICreateDepartmentDTO, ICreatePositionDTO, different } from '/project/shared'
import { global_constants } from '/project/shared'
import * as datefns from 'date-fns'

export interface IAppContext {
  appState: {
    departments: IDepartmentDTO[],
    userPositions: IUserPositionDTO[],
    users: IUserDTO[]
  },
  handler: {
    add_user_position: () => void,
    add_department: () => void,
    add_user: () => void,
    edit_user: (user: IUserDTO, payload: { [k in keyof IUserDTO]: string|number }) => void,
    edit_user_position: (position: IUserPositionDTO) => void
    edit_departent: (department: IDepartmentDTO) => void,
    delete_department: (department: IDepartmentDTO) => void,
    delete_user_position: (position: IUserPositionDTO) => void,
    delete_user: (user: IUserDTO) => void,
  }
}

export const AppContext = React.createContext<IAppContext>({} as IAppContext)

export const AppProvider = (props: { children: any }) => {
  const [appState, setAppState] = React.useState<{
    departments: IDepartmentDTO[],
    userPositions: IUserPositionDTO[],
    users: IUserDTO[]
  }>({ departments: [], userPositions: [], users: []})

  const modalInputContext = useInputModal()
  const modalContext = useModal()

  React.useEffect(() => {
    consumeAPI(
      () => Promise.all([
        AppService.DepartmentService.getAll(),
        AppService.UserService.getAll(),
        AppService.PositionService.getAll()
      ]),
      ([departments,users, userPositions ]) => {
        setAppState({
          departments, userPositions, users
        })
      },
      modalContext.handler.error
    )
  }, [])

  async function delete_department(department: IDepartmentDTO){
    const confirmed = await modalContext.handler.wait({
      title: `Delete department`,
      message: <>
        <div>Are you sure that?</div>
        <div>The department <b>{department.departName}</b> will be removed.</div>
        <div>This actions wont be restored.</div>
      </>
    })
    if(confirmed){
      AppService.DepartmentService.delete(department)
        .then(() => { 
          setAppState(s => ({
            ...s, departments: s.departments.filter(d => d.departId != department.departId)
          }))
        })
        .then(modalContext.handler.close)
        .catch(modalContext.handler.error)
    }
  }

  async function delete_user_position(position: IUserPositionDTO){
    const confirmed = await modalContext.handler.wait({
      title: `Delete staff position`,
      message: <>
        <div>Are you sure that?</div>
        <div>The postition <b>{position.posName}</b> will be removed.</div>
        <div>This actions wont be restored.</div>
      </>
    })
    if(confirmed){
      AppService.PositionService.delete(position)
        .then(() => { 
          setAppState(s => ({
            ...s, userPositions: s.userPositions.filter(p => p.posId != position.posId)
          }))
        })
        .then(modalContext.handler.close)
        .catch(modalContext.handler.error)
    }
  }

  async function delete_user(user: IUserDTO){
    const confirmed = await modalContext.handler.wait({
      title: `Delete staff`,
      message: <>
        <div>Are you sure that?</div>
        <div>The user <b>{user.userName}</b> will be removed.</div>
        <div>This actions wont be restored.</div>
      </>
    })
    if(confirmed){
      AppService.UserService.delete(user)
        .then(() => { 
          setAppState(s => ({
            ...s, users: s.users.filter(u => u.userId != user.userId)
          }))
        })
        .then(modalContext.handler.close)
        .catch(modalContext.handler.error)
    }
  }

  async function add_user(){
    modalInputContext.handler.open({
      title: 'New User',
      config: { cols: 2 },
      payload: <>
        <InputModal.TextField
          proKey='employeeId' 
          label='EmployeeId'
          required={true}
          verify={ e => !StringVerify.employeeId.test(e) ? StringVerify.employeeId.error : undefined  }
        ></InputModal.TextField>
        <InputModal.TextField
          proKey='userName' 
          label='Name'
          required={true}
          verify={ e => !StringVerify.onlyaZSpace.test(e) ? StringVerify.onlyaZSpace.error : undefined  }
        ></InputModal.TextField>
        <InputModal.SelectField 
          proKey='departId' 
          label='Departement'
          displayPro='departName'
          lists={appState.departments}
          required={true}
        />
        <InputModal.SelectField 
          proKey='posId' 
          label='Position'
          displayPro='posCode'
          lists={appState.userPositions}
          required={true}
        />
        <InputModal.DatePicker
          proKey='inDate'
          label='In Date'
          required={true}
        />
        <InputModal.DatePicker
          proKey='birthday'
          label='Birthday'
          required={true}
        />
      </>
      ,
      callback: async (newUser) => {
        const { posId, departId, employeeId, userName, inDate, birthday } = newUser
        if(!departId || !employeeId || !userName ||
          !posId || !birthday || !inDate){
            return
          }
        const confirmed = await modalContext.handler.wait({
          title: "Confirmation is required",
          message: [
            `Would you like to create a new user with below informations?`,
            `EmployeeId: ${newUser.employeeId}`,
            `Name: ${newUser.userName}`,
            `Department: ${departId.departName}`,
            `Position: ${posId.posName}`,
            `Birthday: ${datefns.format(birthday, 'yyyy-MM-dd')}`,
            `InDate: ${datefns.format(inDate, 'yyyy-MM-dd')}`
          ]
        })
        if(confirmed){
          AppService.UserService.post({ employeeId, userName, departId, posId, inDate, birthday })
          .then(newUser => setAppState(s => ({
            ...s, users: [...s.users, newUser]
          })) )
          .then(modalInputContext.handler.close)
          .then(modalContext.handler.close)
          .catch(modalContext.handler.error)
        }
      }
    })
  }

  async function edit_user(user: IUserDTO){
    
  }

  async function add_department(){
    modalInputContext.handler.open<ICreateDepartmentDTO>({
      config: { cols: 1 },
      title: "New Department",
      payload: <>
        <InputModal.TextField 
          required={true}
          proKey='departName'
          label="Name"
          verify={val => !StringVerify.onlyaZSpace.test(val) && StringVerify.onlyaZSpace.error || undefined }
        />
        <InputModal.TextField 
          required={true}
          proKey='departCode'
          label="Code"
          verify={val => !StringVerify.onlyAZSpace.test(val) && StringVerify.onlyAZSpace.error || undefined }
        />
      </>
      ,callback: async (newDept) => {
        const { departName, departCode } = newDept
        if(!departCode || !departName) return
        const confirmed = await modalContext.handler.wait({
          title: 'Confirmation',
          message: [
            `Would you like to create new department with the following information?`,
            `Name: ${departName}`,
            `Code: ${departCode}`
          ]
        })
  
        if(confirmed) {
          AppService.DepartmentService
            .post({ departName, departCode })
            .then(department => {
              setAppState(s => ({ 
                ...s,
                departments: [...s.departments, department ]
              }))
            })
            .then(modalContext.handler.close)
            .then(modalInputContext.handler.close)
            .catch(modalContext.handler.error)
        }
        
      }
    })
  }

  async function add_user_position(){
    modalInputContext.handler.open<ICreatePositionDTO>({
      title: "New Staff Position",
      payload: <>
        <InputModal.TextField 
          required={true}
          proKey='posName'
          verify={val => !StringVerify.onlyaZSpace.test(val) && StringVerify.onlyaZSpace.error || undefined } 
          label='Name'
        />
        <InputModal.TextField 
          required={true}
          proKey='posCode'
          verify={val => !StringVerify.onlyAZSpace.test(val) && StringVerify.onlyAZSpace.error || undefined } 
          label='Code'
        />
      </>
      ,callback: async (newUPos) => {
        const { posName, posCode } = newUPos
        if(!posName || !posCode) return
        const confirmed = await modalContext.handler.wait({
          title: 'Confirmation',
          message: [
            `Would you like to create new staff position with the following information?`,
            `Name: ${posName}`,
            `Code: ${posCode}`
          ]
        })
  
        if(confirmed) {
          AppService.PositionService
            .post({ posName, posCode })
            .then(userPosition => {
              setAppState(s => ({ 
                ...s,
                userPositions: [...s.userPositions, userPosition ]
              }))
            })
            .then(modalContext.handler.close)
            .then(modalInputContext.handler.close)
            .catch(modalContext.handler.error)
        }
      }
    })
  }

  async function edit_user_position(pos: IUserPositionDTO){
    const { posName, posCode, posId } = pos
    modalInputContext.handler.open<IUserPositionDTO>({
      title: 'Edit Staff Position',
      payload: <>
        <InputModal.TextField 
          value={posName}
          proKey='posName'
          label='Name'
          required={true}
          verify={val => !StringVerify.onlyaZSpace.test(val) && StringVerify.onlyaZSpace.error || undefined }
        />
        <InputModal.TextField 
          value={posCode}
          proKey='posCode'
          label='Code'
          required={true}
          verify={val => !StringVerify.onlyAZ.test(val) && StringVerify.onlyAZ.error || undefined }
        />
      </>,
      callback: async (edited) => {
        if(!edited || Object.keys(edited).length == 0) return
        const diffs = different(
          { posCode, posName }, 
          { posCode: edited.posCode, posName: edited.posName }
        )
        if(Object.keys(diffs).length == 0){
          modalContext.handler.info(`There is nothing changed`)
          return
        }
        const confirmed = await modalContext.handler.wait({
          title: "Confirmation is required",
          message: 
            <div>
              <div>Would you like to update staff position as bellow information?</div>
              {
                global_constants.helpers
                .entries(diffs)
                .map((diff) => {
                  const k = diff![0]
                  const v = diff![1]
                  return <div>
                    <span>{k}: From&nbsp;</span>
                    <span className='font-semibold'>{pos[k]}</span>
                    <span>&nbsp;to&nbsp;</span>
                    <span className='font-semibold'>{v}</span>
                  </div>
                })
              }
            </div>
        })
        if(!confirmed) return
        AppService.PositionService
          .put(posId)(edited)
          .then(userPosition => {
            setAppState(s => ({ 
              ...s,
              userPositions: s.userPositions.map(p => 
                p.posId == posId 
                  ? userPosition 
                  : p)
            }))
          })
          .then(modalContext.handler.close)
          .then(modalInputContext.handler.close)
          .catch(modalContext.handler.error)
      }
    })
  }

  async function edit_departent(department: IDepartmentDTO){
    const { departName, departCode, departId } = department
    modalInputContext.handler.open<IDepartmentDTO>({
      title: 'Edit Department',
      payload: <>
        <InputModal.TextField 
          value={departName}
          proKey='departName'
          label='Name'
          required={true}
          verify={val => !StringVerify.onlyaZSpace.test(val) && StringVerify.onlyaZSpace.error || undefined }
        />
        <InputModal.TextField 
          value={departCode}
          proKey='departCode'
          label='Code'
          required={true}
          verify={val => !StringVerify.onlyAZ.test(val) && StringVerify.onlyAZ.error || undefined }
        />
      </>,
      callback: async (edited) => {
        if(!edited || Object.keys(edited).length == 0) return
        const diffs = different(
          { departCode, departName }, 
          { departCode: edited.departCode, departName: edited.departName }
        )
        if(Object.keys(diffs).length == 0){
          modalContext.handler.info(`There is nothing changed`)
          return
        }
        const confirmed = await modalContext.handler.wait({
          title: "Confirmation is required",
          message: 
            <div>
              <div>Would you like to update department as bellow information?</div>
              {
                global_constants.helpers
                .entries(diffs)
                .map((diff) => {
                  const k = diff![0]
                  const v = diff![1]
                  return <div>
                    <span>{k}: From&nbsp;</span>
                    <span className='font-semibold'>{department[k]}</span>
                    <span>&nbsp;to&nbsp;</span>
                    <span className='font-semibold'>{v}</span>
                  </div>
                })
              }
            </div>
        })
        if(!confirmed) return
        AppService.DepartmentService
          .put(departId)(edited)
          .then(department => {
            setAppState(s => ({ 
              ...s,
              departments: s.departments.map(d => 
                d.departId == departId 
                  ? department : d ) 
            }))
          })
          .then(modalContext.handler.close)
          .then(modalInputContext.handler.close)
          .catch(modalContext.handler.error)
      }
    })
  }

  const appContext: IAppContext = {
    appState,
    handler: {
      edit_departent,
      edit_user_position,
      edit_user,
      add_user_position,
      add_department,
      add_user,
      delete_department,
      delete_user,
      delete_user_position
    }
  }

  return (
    <AppContext.Provider value={appContext} >
      { props.children }
    </AppContext.Provider>
  )
}


export const useAppState = () => React.useContext(AppContext)