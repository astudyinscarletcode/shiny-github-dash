/**
 * Component to display provided organizations in a table.
 * Does not save state.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'
import {Table, TableBody} from 'material-ui/Table'

// Class --------------------------------------------------------------------------------------------------------------

/**
 * Component that displays a table of organizations or a text, if no organizations are provided.
 *
 * @param organizations {[Object]} the needs to display.
 * @param noOrganizationsText {String} the text to display if there are no needs.
 * @param errors {Object} the error state of the wrapping component.
 */
const OrganizationList = ({organizations, noOrganizationsText, errors}) => (
  <div className='organization-list'>
    {errors.summary && <p>{errors.summary}</p>}
    {(organizations.length === 0) && <p >{noOrganizationsText}</p> }
    {(organizations.length > 0) && (
    <div>
      <Table>
        <TableBody
          selectable={false}
          showRowHover
          stripedRows
          displayRowCheckbox={false}
        >
          {organizations.map((organization) => (<p>{organization.name}</p>))}
        </TableBody>
      </Table>
    </div>
    )}
  </div>
)

// Exports ------------------------------------------------------------------------------------------------------------
export default OrganizationList
