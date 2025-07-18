import React, { useState, useEffect } from 'react';
import { AffiliateProgram } from '../../components/affiliate/AffiliateProgram';
import { userService } from '../../services/user/userService';
import { toast } from 'sonner';
export const AffiliatePage = () => {
  return <div className="space-y-6">
      
      <AffiliateProgram />
    </div>;
};