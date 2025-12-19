import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';

import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
// hooks
import { useBoolean } from 'src/hooks/use-boolean';
// components
import { Tooltip } from '@mui/material';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useNavigate } from 'react-router';
import { paths } from 'src/routes/paths';


// ----------------------------------------------------------------------

export default function BondEstimationsTableRow({ row, selected, onViewRow, onSelectRow, onDeleteRow }) {
  const { id, currentProgress, createdAt } = row;
  const navigate = useNavigate();
  const confirm = useBoolean();
  const popover = usePopover();

  const getStatus = () => {
    if(currentProgress?.includes('initialize')){
      return 'In Process';
    }
  }

  const getColor = () => {
    if(currentProgress?.includes('initialize')){
      return 'warning';
    }
  }

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {id || 'N/A'}
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={getColor()}
          >
            {getStatus()}
          </Label>
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {createdAt ? new Date(createdAt).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          }) : 'N/A'}
        </TableCell>

        {/* Actions */}
        <TableCell align="center" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <Tooltip title="View Application">
            <IconButton onClick={() => navigate(paths.dashboard.issureservices.roifundform(id))}>
              <Iconify icon="carbon:view-filled" />
            </IconButton>
          </Tooltip>
          {/* <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <ToolTip>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton> */}
        </TableCell>
      </TableRow>

      {/* Popover */}
      {/* <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top" sx={{ width: 140 }}>
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>
      </CustomPopover> */}

      {/* Confirm Delete Dialog */}
      {/* <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content={`Are you sure you want to delete ${companyName || ''}?`}
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            View
          </Button>
        }
      /> */}
    </>
  );
}

BondEstimationsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};
