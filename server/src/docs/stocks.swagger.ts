/**
 * @swagger
 * /api/bvc/stocks:
 *   get:
 *     summary: Get all BVC stocks
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: List of all stocks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Stock'
 */

/**
 * @swagger
 * /api/bvc/stocks/{symbol}:
 *   get:
 *     summary: Get stock by symbol
 *     tags: [Stocks]
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: Stock symbol (e.g., ATW, IAM, BCP)
 *     responses:
 *       200:
 *         description: Stock data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Stock'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/bvc/indices:
 *   get:
 *     summary: Get market indices (MASI, MADEX)
 *     tags: [Stocks]
 *     responses:
 *       200:
 *         description: Market indices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     masi:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 13450.25
 *                         change:
 *                           type: number
 *                           example: 125.5
 *                         changePercent:
 *                           type: number
 *                           example: 0.94
 *                     madex:
 *                       type: object
 *                       properties:
 *                         value:
 *                           type: number
 *                           example: 10850.75
 *                         change:
 *                           type: number
 *                           example: 95.3
 *                         changePercent:
 *                           type: number
 *                           example: 0.88
 */
