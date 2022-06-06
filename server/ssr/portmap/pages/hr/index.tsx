import React from 'react'
import { useAppState, Table } from '../../components'
import * as datefns from 'date-fns'
import { IUserDTO } from '/project/shared'

const HumanResource = React.memo(() => {
  const { appState, handler } = useAppState()
  const {departments, users, userPositions } = appState

  return (
    <div className='flex flex-row h-full flex-wrap p-4'>
      <Table.Wrapper 
        className='flex-1 max-h-[40%]' 
        data={ departments }
        tableName="Departments"
        onAdd={ handler.add_department }
        onRowClick={ handler.edit_departent }
        onRowDelete={ handler.delete_department }
      >
        <Table.Header>
          <Table.HeaderCol 
            width={2}
            label='Name' 
            proKey="departName"/>
          <Table.HeaderCol 
            width={1}
            label='Code' 
            proKey='departCode' />
          <Table.HeaderCol 
            width={1}
            label='Status'
            proKey='departState' 
            render={val => val["flagId"]}
          />
        </Table.Header>
      </Table.Wrapper>

      <div className='w-4'></div>

      <Table.Wrapper 
        className='flex-1 max-h-[40%]' 
        data={ userPositions }
        tableName="Staff Position"
        onAdd={ handler.add_user_position }
        onRowClick={ handler.edit_user_position }
        onRowDelete={ handler.delete_user_position }
      >
        <Table.Header>
          <Table.HeaderCol 
            label='Name' 
            proKey="posName"/>
          <Table.HeaderCol 
            label='Code' 
            proKey='posCode' />
        </Table.Header>
      </Table.Wrapper>
      <Table.Wrapper 
        className='mt-4 min-h-[calc(60%-1rem)]' 
        data={appState.users}
        tableName="Users"
        onAdd={handler.add_user}
        onRowClick={ row => alert(JSON.stringify(row, null, 4))}
        onRowDelete={ handler.delete_user }
      >
        <Table.Header>
          <Table.HeaderCol 
            label='Employee ID' 
            proKey="employeeId"/>
          <Table.HeaderCol 
            label='Name' 
            proKey='userName' />
          <Table.HeaderCol 
            label='Email'
            proKey='email' />
          <Table.HeaderCol 
            label='Department' 
            proKey='department' 
            render={val => val["departCode"]}/>
          <Table.HeaderCol 
            label='Position' 
            proKey='position' 
            render={val => val["posName"]}/>
          <Table.HeaderCol 
            label='Birthday' 
            proKey='birthday' 
            render={val => datefns.format(+val, "yyyy-MM-dd")}
          />
          <Table.HeaderCol 
            label='In Date' 
            proKey='inDate' 
            render={val => datefns.format(+val, "yyyy-MM-dd")}
          />
        </Table.Header>
      </Table.Wrapper>
    </div>
  )
})

export default HumanResource