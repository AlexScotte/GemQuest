#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("ApLERHGGnmjWrTqoDFUVKotBZ7ZcDELcjQHyGNXG5APB");

#[program]
pub mod gem_quest {
    use super::*;

  pub fn close(_ctx: Context<CloseGemQuest>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.gem_quest.count = ctx.accounts.gem_quest.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.gem_quest.count = ctx.accounts.gem_quest.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeGemQuest>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.gem_quest.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeGemQuest<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + GemQuest::INIT_SPACE,
  payer = payer
  )]
  pub gem_quest: Account<'info, GemQuest>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseGemQuest<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub gem_quest: Account<'info, GemQuest>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub gem_quest: Account<'info, GemQuest>,
}

#[account]
#[derive(InitSpace)]
pub struct GemQuest {
  count: u8,
}
