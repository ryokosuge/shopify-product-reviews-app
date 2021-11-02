/**
 * Check if an specific app block was added to a template file.
 */
export const containsAppBlock = (
  templateJSONAssetContent: string,
  appBlockName: string,
  themeAppExtensionUUID: string,
) => {
  const regExp = new RegExp(
    `shopify:\/\/apps\/.*\/blocks\/${appBlockName}\/${themeAppExtensionUUID}`,
  );

  const parsedContent: { [key: string]: any } = JSON.parse(
    templateJSONAssetContent,
  );

  /**
   * Retrieves all blocks belonging to template sections.
   */
  const sections = Object.values<{ [key: string]: any }>(
    parsedContent.sections || {},
  );

  const blocks = sections
    .map<{ [key: string]: any }>((section) =>
      section.blocks != null
        ? Object.values<{ [key: string]: any }>(section.blocks)
        : {},
    )
    .flat();

  return blocks.some((block) => regExp.test(block.type));
};
